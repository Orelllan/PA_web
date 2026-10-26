
const typeSelect=document.getElementById( 'tipo' );

document.querySelectorAll( '.choose' ).forEach(
    b=>b.addEventListener(
        'click',( )=>{

            typeSelect.value=b.dataset.type;
            document.getElementById('cotizar').scrollIntoView({behavior:'smooth'});
            typeSelect.focus()

        }
    )
);

const ids=['largo','ancho','espesor','cantidad'];
function updateVolume(){
    const L=parseFloat(document.getElementById('largo').value),
    A=parseFloat(document.getElementById('ancho').value),
    E=parseFloat(document.getElementById('espesor').value),
    Q=parseFloat(document.getElementById('cantidad').value);

    const valid=[L,A,E,Q].every(
        v=>Number.isFinite(v) && v > 0
    );

    document.getElementById('estimate').innerHTML=valid?
        '<strong>Volumen estimado: '+((L*(A/100)*(E/100)*Q).toFixed(4))+
        ' m³</strong>Estimación matemática según las medidas ingresadas; confirmar medidas comerciales y cortes. No es una cotización de precio.':
        '<strong>Volumen estimado: —</strong>Completa largo, ancho, espesor y cantidad para estimar el volumen en m³. Es una referencia, no un precio.'
}

ids.forEach(id=>document.getElementById(id).addEventListener(
    'input',updateVolume
));

function getMessage(){
    const v=id=>document.getElementById(id).value.trim()||'No especificado';
    return `SOLICITUD DE COTIZACIÓN — MADERERA GUZMÁN F y H\n\n
        Nombre: ${v('nombre')}\n
        Teléfono: ${v('telefono')}\n
        Tipo de madera: ${v('tipo')}\n
        Producto: ${v('producto')}\n
        Medidas: 
            largo ${v('largo')} m; 
            ancho ${v('ancho')} cm; 
            espesor ${v('espesor')} 
            cm\nCantidad: ${v('cantidad')} 
            piezas\nCalidad/selección: ${v('calidad')}\n
        Entrega: ${v('entrega')}\n
        Lugar: ${v('lugar')}\n
        Detalles: ${v('detalle')}\n\n
        Solicito confirmar disponibilidad, precio y condiciones de entrega.`
}

document.getElementById('quoteForm').addEventListener('submit',e=>{
    e.preventDefault();
    const msg=encodeURIComponent(getMessage());
    const WHATSAPP_NUMBER='COLOCA_AQUI_EL_NUMERO';
    if(!/^\d{10,15}$/.test(WHATSAPP_NUMBER)){

        alert(
            'Falta configurar el WhatsApp oficial de Maderera Guzmán F y H.' + 
            ' En el código, reemplaza COLOCA_AQUI_EL_NUMERO por el número completo con código de país,'+ 
            ' solo dígitos y sin + ni espacios.'
        );

        return 
    }
    window.open(
            'https://wa.me/'+WHATSAPP_NUMBER+'?text='+msg,'_blank'
    )});
    
    document.getElementById('copyBtn').addEventListener(
        'click',async()=>{
            try{
                await navigator.clipboard.writeText(getMessage());
                alert('Solicitud copiada. Ya puedes pegarla en WhatsApp o en un correo.')
            }
            catch(e){
                prompt('Copia tu solicitud:',getMessage()
                )
            }
        }
    );
