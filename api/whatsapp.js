
export default async function handler(req, res) {
    // Permitir solo peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const { nombre, telefono, ubicacion, detalle } = req.body;

    // Obtener variables de entorno configuradas en Vercel
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

    if (!META_ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        return res.status(500).json({ 
            success: false, 
            message: 'Faltan las variables de entorno en Vercel (META_ACCESS_TOKEN o PHONE_NUMBER_ID).' 
        });
    }

    // Formatear el número de teléfono (asumiendo formato Perú '51', ajustar según requerimiento)
    let phoneFormatted = telefono.replace(/\D/g, '');
    if (!phoneFormatted.startsWith('51') && phoneFormatted.length === 9) {
        phoneFormatted = '51' + phoneFormatted;
    }

    try {
        const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: phoneFormatted,
                type: 'template',
                template: {
                    name: 'solicitud_cotizacion', // Nombre de la plantilla aprobada en Meta
                    language: { code: 'es' },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: nombre || 'Cliente' },
                                { type: 'text', text: telefono || 'Sin número' },
                                { type: 'text', text: ubicacion || 'No especificada' },
                                { type: 'text', text: detalle || 'Sin detalles' }
                            ]
                        }
                    ]
                }
            })
        });

        const data = await metaResponse.json();

        if (metaResponse.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            console.error('Error desde Meta API:', data);
            return res.status(400).json({ success: false, error: data });
        }

    } catch (error) {
        console.error('Error en la función serverless:', error);
        return res.status(500).json({ success: false, message: 'Error interno en el servidor.' });
    }
}
