

const CONFIG = {
    // Reemplaza estas 3 claves con los datos obtenidos en el Paso 1:
    emailjsPublicKey: 'XMdtUXA4EP02Xxtba',
    emailjsServiceId: 'service_gqvv85l',
    emailjsTemplateId: 'template_1d75ikm',

    
    whatsappNumber: '51995041554'
};

// Inicializar el SDK de EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(CONFIG.emailjsPublicKey);
    }
})();


// REFERENCIAS Y EVENTOS DOM

const medioContactoSelect = document.getElementById('medioContacto');
const submitBtn = document.getElementById('submitBtn');
const detalleInput = document.getElementById('detalle');
const quoteForm = document.getElementById('quoteForm');

// Cambiar dinámicamente el texto del botón
if (medioContactoSelect && submitBtn) {
    medioContactoSelect.addEventListener('change', () => {
        submitBtn.textContent = medioContactoSelect.value === 'whatsapp' 
            ? 'Enviar por WhatsApp' 
            : 'Enviar por Gmail';
    });
}

// Acción de los botones "Cotiza" e "Información" del catálogo
document.querySelectorAll('.choose').forEach(button => {
    button.addEventListener('click', () => {
        const maderaType = button.dataset.type || 'Madera seleccionada';
        if (detalleInput) {
            detalleInput.value = `Hola, me interesa solicitar cotización sobre la madera: ${maderaType}.`;
            document.getElementById('cotizar').scrollIntoView({ behavior: 'smooth' });
            detalleInput.focus();
        }
    });
});

document.querySelectorAll('.info').forEach(button => {
    button.addEventListener('click', () => {
        const madera = button.dataset.type;
        if (madera) {
            window.location.href = `informacion.html?madera=${encodeURIComponent(madera)}`;
        }
    });
});

//
// ENVÍO AUTOMÁTICO DEL FORMULARIO
// 
if (quoteForm) {
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const canal = medioContactoSelect.value;
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const ubicacion = document.getElementById('ubicacion').value.trim() || 'No especificada';
        const detalle = document.getElementById('detalle').value.trim() || 'Sin detalles adicionales';

        if (canal === 'gmail') {
            // ENVÍO AUTOMÁTICO VÍA EMAILJS
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando correo...';

            const templateParams = {
                nombre: nombre,
                telefono: telefono,
                email: email,
                ubicacion: ubicacion,
                detalle: detalle
            };

            try {
                await emailjs.send(CONFIG.emailjsServiceId, CONFIG.emailjsTemplateId, templateParams);
                alert('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo a la brevedad.');
                quoteForm.reset();
            } catch (error) {
                console.error('Error al enviar correo con EmailJS:', error);
                alert('Ocurrió un error al enviar el correo. Inténtalo nuevamente o selecciona WhatsApp.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar por Gmail';
            }

        } else if (canal === 'whatsapp') {
            // ENVÍO VÍA REDIRECCIÓN A WHATSAPP
            const mensajeWa = `SOLICITUD DE COTIZACIÓN — MADERERA GUZMÁN F y H\n\n` +
                              `Nombre: ${nombre}\n` +
                              `Teléfono: ${telefono}\n` +
                              `Correo: ${email}\n` +
                              `Ubicación: ${ubicacion}\n` +
                              `Detalle: ${detalle}`;

            const urlWa = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensajeWa)}`;
            window.open(urlWa, '_blank');
        }
    });
}

// Botón para copiar el contenido
const copyBtn = document.getElementById('copyBtn');
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
            prompt('Copia tu solicitud:', texto);
        }
    });
}