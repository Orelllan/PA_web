
// CONFIGURACIÓN DE EMAILJS

const CONFIG_EMAILJS = {
    publicKey: 'XMdtUXA4EP02Xxtba',   // 
    serviceId: 'service_gqvv85l',   // 
    templateId: 'template_1d75ikm'  // 
};

// Inicializar EmailJS si el SDK se cargó correctamente en el HTML
(function() {
    if (typeof emailjs !== 'undefined' && CONFIG_EMAILJS.publicKey !== 'XMdtUXA4EP02Xxtba') {
        emailjs.init(CONFIG_EMAILJS.publicKey);
    }
})();


// OBTENER REFERENCIAS AL DOM

const medioContactoSelect = document.getElementById('medioContacto');
const submitBtn = document.getElementById('submitBtn');
const quoteForm = document.getElementById('quoteForm');
const detalleInput = document.getElementById('detalle');
const copyBtn = document.getElementById('copyBtn');


// CAMBIAR TEXTO DEL BOTÓN SEGÚN CANAL

if (medioContactoSelect && submitBtn) {
    medioContactoSelect.addEventListener('change', () => {
        if (medioContactoSelect.value === 'whatsapp') {
            submitBtn.textContent = 'Enviar por WhatsApp';
        } else {
            submitBtn.textContent = 'Enviar por Gmail';
        }
    });
}


//  ACCIONES DE BOTONES EN EL CATÁLOGO


// Botón Cotiza Escribe el nombre de la madera en la consulta, desplaza la pantalla y enfoca el campo.
document.querySelectorAll('.choose').forEach(button => {
    button.addEventListener('click', () => {
        const maderaType = button.dataset.type || 'Madera seleccionada';
        if (detalleInput) {
            detalleInput.value = `Hola, me interesa solicitar cotización e información sobre la madera: ${maderaType}.`;
            const cotizarSection = document.getElementById('cotizar');
            if (cotizarSection) {
                cotizarSection.scrollIntoView({ behavior: 'smooth' });
            }
            detalleInput.focus();
        }
    });
});

// Botón Información Redirige a la página de detalles pasando el parámetro de la madera.
document.querySelectorAll('.info').forEach(button => {
    button.addEventListener('click', () => {
        const madera = button.dataset.type;
        if (madera) {
            window.location.href = `informacion.html?madera=${encodeURIComponent(madera)}`;
        }
    });
});


// ENVÍO DEL FORMULARIO (WHATSAPP / GMAIL)
if (quoteForm) {
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const canal = medioContactoSelect ? medioContactoSelect.value : 'whatsapp';
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const telefono = document.getElementById('telefono')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const ubicacion = document.getElementById('ubicacion')?.value.trim() || 'No especificada';
        const detalle = document.getElementById('detalle')?.value.trim() || 'Sin detalles adicionales';

        // WHATSAPP VÍA VERCEL 
        if (canal === 'whatsapp') {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando WhatsApp...';

            try {
                const response = await fetch('/api/whatsapp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, telefono, ubicacion, detalle })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('¡Solicitud enviada con éxito por WhatsApp!');
                    quoteForm.reset();
                } else {
                    throw new Error(result.message || 'Error al procesar el envío por WhatsApp');
                }
            } catch (error) {
                console.error('Error WhatsApp:', error);
                alert('No se pudo enviar el mensaje por WhatsApp. Inténtalo nuevamente o prueba la opción de Gmail.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar por WhatsApp';
            }

        // GMAIL VÍA 
        } else if (canal === 'gmail') {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando correo...';

            try {
                if (typeof emailjs === 'undefined' || CONFIG_EMAILJS.publicKey === 'TU_PUBLIC_KEY_EMAILJS') {
                    throw new Error('EmailJS no está configurado. Revisa las credenciales en Funcionallity.js.');
                }

                await emailjs.send(
                    CONFIG_EMAILJS.serviceId, 
                    CONFIG_EMAILJS.templateId, 
                    { nombre, telefono, email, ubicacion, detalle }
                );

                alert('¡Correo enviado con éxito! Nos comunicaremos contigo pronto.');
                quoteForm.reset();
            } catch (err) {
                console.error('Error EmailJS:', err);
                alert('Ocurrió un error al enviar el correo automático. Verifica la configuración de EmailJS.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar por Gmail';
            }
        }
    });
}


// COPIAR DATOS DE LA SOLICITUD
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        const v = id => document.getElementById(id)?.value.trim() || 'No especificado';
        const texto = `SOLICITUD DE COTIZACIÓN — MADERERA GUZMÁN F y H\n\n` +
                      `Nombre: ${v('nombre')}\n` +
                      `Teléfono: ${v('telefono')}\n` +
                      `Correo: ${v('email')}\n` +
                      `Ubicación: ${v('ubicacion')}\n` +
                      `Detalle: ${v('detalle')}`;
        try {
            await navigator.clipboard.writeText(texto);
            alert('Datos copiados al portapapeles.');
        } catch (e) {
            prompt('Copia tu solicitud manualmente:', texto);
        }
    });
}