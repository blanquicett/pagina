// Inicializar carritoItems
let carritoItems = [];

// Al inicio del archivo, después de declarar carritoItems
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar EmailJS
    emailjs.init("4xjl5alzO63_tfwSK"); // Reemplaza con tu Public Key de EmailJS

    // Recuperar items del localStorage (código existente)
    const itemsGuardados = localStorage.getItem('carritoItems');
    if (itemsGuardados) {
        carritoItems = JSON.parse(itemsGuardados);
        console.log('Carrito cargado:', carritoItems);
    }
});

// Cargar items del carrito cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    const itemsGuardados = localStorage.getItem('carritoItems');
    if (itemsGuardados) {
        carritoItems = JSON.parse(itemsGuardados);
        console.log('Carrito cargado:', carritoItems); // Para depuración
    }
});

// Objeto para controlar validación
const validaciones = {
    nombre: false,
    apellido: false,
    cedula: false,
    celular: false,
    email: false,
    direccion: false,
    ciudad: false,
    departamento: false,
    codigo_postal: false,
    metodo_pago: false
};

// Expresiones regulares para validaciones
const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{3,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{3,40}$/,
    cedula: /^\d{8,10}$/, // 8 a 10 números
    celular: /^\d{10}$/, // 10 números
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    codigo_postal: /^\d{4,6}$/ // 4 a 6 números
};

// Selección de elementos del DOM
const formulario = document.getElementById('formulario-compra');
const campos = {
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    cedula: document.getElementById('cedula'),
    celular: document.getElementById('celular'),
    email: document.getElementById('email'),
    direccion: document.getElementById('direccion'),
    ciudad: document.getElementById('ciudad'),
    departamento: document.getElementById('departamento'),
    codigo_postal: document.getElementById('codigo_postal'),
    metodo_pago: document.getElementById('metodo_pago')
};

// Funciones de validación
const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)){
        document.getElementById(`error-${campo}`).textContent = '';
        input.classList.remove('invalid');
        input.classList.add('valid');
        validaciones[campo] = true;
    } else {
        document.getElementById(`error-${campo}`).textContent = `${campo.charAt(0).toUpperCase() + campo.slice(1)} no válido`;
        input.classList.remove('valid');
        input.classList.add('invalid');
        validaciones[campo] = false;
    }
};

// Validar campos de texto simple
const validarCampoTexto = (input, campo) => {
    if(input.value.length >= 3) {
        document.getElementById(`error-${campo}`).textContent = '';
        input.classList.remove('invalid');
        input.classList.add('valid');
        validaciones[campo] = true;
    } else {
        document.getElementById(`error-${campo}`).textContent = `${campo.charAt(0).toUpperCase() + campo.slice(1)} debe tener al menos 3 caracteres`;
        input.classList.remove('valid');
        input.classList.add('invalid');
        validaciones[campo] = false;
    }
};

// Event Listeners para validación en tiempo real
campos.nombre.addEventListener('input', () => {
    validarCampo(expresiones.nombre, campos.nombre, 'nombre');
});

campos.apellido.addEventListener('input', () => {
    validarCampo(expresiones.apellido, campos.apellido, 'apellido');
});

campos.cedula.addEventListener('input', () => {
    validarCampo(expresiones.cedula, campos.cedula, 'cedula');
});

campos.celular.addEventListener('input', () => {
    validarCampo(expresiones.celular, campos.celular, 'celular');
});

campos.email.addEventListener('input', () => {
    validarCampo(expresiones.email, campos.email, 'email');
});

campos.codigo_postal.addEventListener('input', () => {
    validarCampo(expresiones.codigo_postal, campos.codigo_postal, 'codigo_postal');
});

// Validación de campos de texto simple
campos.direccion.addEventListener('input', () => {
    validarCampoTexto(campos.direccion, 'direccion');
});

campos.ciudad.addEventListener('input', () => {
    validarCampoTexto(campos.ciudad, 'ciudad');
});

campos.departamento.addEventListener('input', () => {
    validarCampoTexto(campos.departamento, 'departamento');
});

// Validación del método de pago
campos.metodo_pago.addEventListener('change', () => {
    if(campos.metodo_pago.value !== '') {
        document.getElementById('error-metodo_pago').textContent = '';
        validaciones.metodo_pago = true;
        
        // Mostrar/ocultar campos de tarjeta
        const camposTarjeta = document.getElementById('campos-tarjeta');
        if(campos.metodo_pago.value === 'tarjeta') {
            camposTarjeta.classList.remove('oculto');
        } else {
            camposTarjeta.classList.add('oculto');
        }
    } else {
        document.getElementById('error-metodo_pago').textContent = 'Seleccione un método de pago';
        validaciones.metodo_pago = false;
    }
});

// Función para validar todo el formulario
const validarFormulario = () => {
    return Object.values(validaciones).every(valor => valor === true);
};

// Función para mostrar el carrito
function mostrarCarritoModal() {
    // Intentar obtener items actualizados
    const itemsGuardados = localStorage.getItem('carritoItems');
    if (itemsGuardados) {
        carritoItems = JSON.parse(itemsGuardados);
    }

    if (!carritoItems || carritoItems.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'No has agregado productos al carrito',
            icon: 'info',
            confirmButtonColor: '#A8D5BA'
        });
        return;
    }

    let contenidoHTML = `
        <div class="resumen-carrito">
            <h3>Productos Seleccionados</h3>
            <div class="items-carrito">
    `;

    let total = 0;

    carritoItems.forEach(item => {
        const precio = parseFloat(item.precio);
        contenidoHTML += `
            <div class="item-carrito">
                <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="item-detalles">
                    <h4>${item.nombre}</h4>
                    <p>$${precio.toFixed(3)}</p>
                </div>
            </div>
        `;
        total += precio;
    });

    contenidoHTML += `
            </div>
            <div class="total-carrito">
                <h4>Total: $${total.toFixed(3)}</h4>
            </div>
        </div>
    `;

    Swal.fire({
        title: 'Tu Carrito',
        html: contenidoHTML,
        confirmButtonColor: '#A8D5BA',
        confirmButtonText: 'Cerrar',
        width: '600px'
    });
}

// Manejador del formulario
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos correctamente',
            icon: 'error',
            confirmButtonColor: '#A8D5BA'
        });
        return;
    }

    if (carritoItems.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'Agrega productos antes de continuar',
            icon: 'warning',
            confirmButtonColor: '#A8D5BA'
        });
        return;
    }

    // Crear resumen de la compra para el correo
    let resumenCompra = '';
    let total = 0;
    
    carritoItems.forEach(item => {
        const precio = parseFloat(item.precio);
        resumenCompra += `${item.nombre} - $${precio.toFixed(2)}\n`;
        total += precio;
    });

     // Preparar los parámetros para la plantilla de correo
     const templateParams = {
        to_name: campos.nombre.value,
        to_email: campos.email.value,
        from_name: "STEPSTYLE",
        message: "¡GRACIAS POR TU COMPRA EN STEPSTYLE!",
        resumen_compra: resumenCompra,
        total: total.toFixed(3)
    };

    // Mostrar confirmación
    Swal.fire({
        title: '¿Confirmar compra?',
        text: '¿Deseas finalizar la compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#A8D5BA',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, comprar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar procesando
            Swal.fire({
                title: 'Procesando...',
                text: 'Por favor espera',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Enviar el email
            emailjs.send(
                "service_v1q6ne9", // Reemplaza con tu Service ID
                "template_mkhtb7c", // Reemplaza con tu Template ID
                templateParams
            )
            .then(function(response) {
                console.log("Correo enviado:", response);
                Swal.fire({
                    title: '¡Compra Exitosa!',
                    text: 'Te hemos enviado un correo de confirmación',
                    icon: 'success',
                    confirmButtonColor: '#A8D5BA'
                }).then(() => {
                    carritoItems = [];
                    localStorage.removeItem('carritoItems');
                    formulario.reset();
                });
            })
            .catch(function(error) {
                console.error("Error:", error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar el correo de confirmación',
                    icon: 'error',
                    confirmButtonColor: '#A8D5BA'
                });
            });
        }
    });
});

// Evento para mostrar el carrito
document.getElementById('ver-carrito-compra').addEventListener('click', mostrarCarritoModal);