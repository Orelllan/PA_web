

// CONFIGURACIÓN DE DATOS DE CONTACTO

const CONFIG = {
    whatsappNumber: '51960835957',

    emailjsPublicKey: 'XMdtUXA4EP02Xxtba',   
    emailjsServiceId: 'service_gqvv85l',   
    emailjsTemplateId: 'template_1d75ikm'  
};

// Inicialización de EmailJS
(function() {
    if (typeof emailjs !== 'undefined' && CONFIG.emailjsPublicKey !== 'XMdtUXA4EP02Xxtba') {
        emailjs.init(CONFIG.emailjsPublicKey);
    }
})();


// ELEMENTOS DEL DOM

const medioContactoSelect = document.getElementById('medioContacto');
const submitBtn = document.getElementById('submitBtn');
const quoteForm = document.getElementById('quoteForm');
const detalleInput = document.getElementById('detalle');
const copyBtn = document.getElementById('copyBtn');


// CAMBIO DINÁMICO DE BOTÓN SEGÚN CANAL

if (medioContactoSelect && submitBtn) {
    medioContactoSelect.addEventListener('change', () => {
        if (medioContactoSelect.value === 'whatsapp') {
            submitBtn.textContent = 'Enviar por WhatsApp';
        } else {
            submitBtn.textContent = 'Enviar por Gmail';
        }
    });
}


// ACCIONES DE NAVEGACIÓN EN EL CATÁLOGO



document.querySelectorAll('.choose').forEach(button => {
    button.addEventListener('click', () => {
        const maderaType = button.dataset.type || 'Madera seleccionada';
        if (detalleInput) {
            detalleInput.value = `Hola, me interesa solicitar cotización sobre la madera: ${maderaType}.`;
            const cotizarSection = document.getElementById('cotizar');
            if (cotizarSection) {
                cotizarSection.scrollIntoView({ behavior: 'smooth' });
            }
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


// PROCESAMIENTO DEL FORMULARIO

if (quoteForm) {
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const canal = medioContactoSelect ? medioContactoSelect.value : 'whatsapp';
        const nombre = document.getElementById('nombre')?.value.trim() || 'No especificado';
        const telefono = document.getElementById('telefono')?.value.trim() || 'No especificado';
        const email = document.getElementById('email')?.value.trim() || 'No especificado';
        const ubicacion = document.getElementById('ubicacion')?.value.trim() || 'No especificada';
        const detalle = document.getElementById('detalle')?.value.trim() || 'Sin detalles adicionales';
        
        // WHATSAPP MANUAL 
        if (canal === 'whatsapp') {
            if (CONFIG.whatsappNumber === '51987654321' || !CONFIG.whatsappNumber) {
                alert('Atención: Reemplaza el número de teléfono en CONFIG.whatsappNumber dentro de Funcionallity.js.');
            }

            const mensajeWa = `SOLICITUD DE COTIZACIÓN — MADERERA GUZMÁN F y H\n\n` +
                              `Nombre: ${nombre}\n` +
                              `Teléfono: ${telefono}\n` +
                              `Correo: ${email}\n` +
                              `Ubicación: ${ubicacion}\n` +
                              `Detalle: ${detalle}`;

            const urlWa = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(mensajeWa)}`;
            window.open(urlWa, '_blank');

        // GMAIL AUTOMÁTICO 
        } else if (canal === 'gmail') {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando correo...';

            try {
                if (typeof emailjs === 'undefined' || CONFIG.emailjsPublicKey === 'TU_PUBLIC_KEY') {
                    throw new Error('Configura tus claves de EmailJS en la constante CONFIG al inicio del archivo JS.');
                }

                await emailjs.send(
                    CONFIG.emailjsServiceId,
                    CONFIG.emailjsTemplateId,
                    {
                        nombre: nombre,
                        telefono: telefono,
                        email: email,
                        ubicacion: ubicacion,
                        detalle: detalle
                    }
                );

                alert('¡Correo enviado con éxito! Recibiremos tus datos y te responderemos a la brevedad.');
                quoteForm.reset();

            } catch (err) {
                console.error('Error al enviar con EmailJS:', err);
                alert('No se pudo enviar el correo automático. Por favor verifica tus datos o selecciona la opción WhatsApp.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar por Gmail (Automático)';
            }
        }
    });
}


// BOTÓN AUXILIAR PARA COPIAR DATOS

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
            alert('Datos copiados al portapapeles. Puedes pegarlos directamente en tu aplicación de mensajería.');
        } catch (e) {
            prompt('Copia tu solicitud manualmente:', texto);
        }
    });
}

