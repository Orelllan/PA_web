
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const { nombre, telefono, ubicacion, detalle } = req.body;

    // Variables de Vercel
    const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
    const RECEIVER = process.env.WHATSAPP_RECEIVER || '51960835957'; 

    if (!META_ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        return res.status(500).json({ 
            success: false, 
            message: 'Faltan configurar las variables de entorno en Vercel (META_ACCESS_TOKEN o PHONE_NUMBER_ID).' 
        });
    }

    // Formatear el número de destino (código de país sin '+')
    let phoneFormatted = RECEIVER.replace(/\D/g, '');
    if (!phoneFormatted.startsWith('51') && phoneFormatted.length === 9) {
        phoneFormatted = '51' + phoneFormatted;
    }

    try {
        const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

        const response = await fetch(url, {
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
                    name: 'solicitud_cotizacion',
                    language: { code: 'es' },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                { type: 'text', text: nombre || 'No especificado' },
                                { type: 'text', text: telefono || 'No especificado' },
                                { type: 'text', text: ubicacion || 'No especificada' },
                                { type: 'text', text: detalle || 'Sin detalle' }
                            ]
                        }
                    ]
                }
            })
        });

        const data = await response.json();

        if (response.ok && data.messages) {
            return res.status(200).json({ success: true, data });
        } else {
            console.error('Error Meta API:', data);
            return res.status(400).json({ success: false, error: data });
        }

    } catch (error) {
        console.error('Error en el servidor Vercel:', error);
        return res.status(500).json({ success: false, message: 'Error interno en el servidor.' });
    }
}