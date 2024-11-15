// Array para almacenar productos
let carritoItems = [];

// Seleccionar botones de compra
const botonesComprar = document.querySelectorAll(".Comprar");

// Añadir evento a cada botón
botonesComprar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
});

// Función para agregar productos al carrito
function agregarAlCarrito(evento) {
    const boton = evento.target;
    const producto = boton.closest('.productos');

    const precioSinFormato = producto.querySelector('h2').textContent.replace('Precio: $', '');
    const precioFormateado = parseFloat(precioSinFormato).toFixed(2);

    const infoProducto = {
        nombre: producto.querySelector('h3').textContent,
        precio: precioFormateado,
        imagen: producto.querySelector('img').src
    };

    carritoItems.push(infoProducto);
    // Guardar en localStorage
    localStorage.setItem('carritoItems', JSON.stringify(carritoItems));
    mostrarCarrito();
   
    // Mostrar mensaje de éxito
    Swal.fire({
        title: '¡Agregado!',
        text: 'Producto agregado al carrito',
        icon: 'success',
        confirmButtonColor: '#A8D5BA'
    });
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const modal = document.getElementById('carrito-modal');
    const itemsContainer = document.getElementById('carrito-items');
    itemsContainer.innerHTML = '';
    let total = 0;

    carritoItems.forEach(item => {
        // Crear elementos
        const itemDiv = document.createElement('div');
        const img = document.createElement('img');
        const detallesDiv = document.createElement('div');
        const titulo = document.createElement('h3');
        const precio = document.createElement('p');

        // Añadir clases
        itemDiv.className = 'carrito-item';
        detallesDiv.className = 'item-detalles';

        // Añadir contenido
        img.src = item.imagen;
        img.alt = item.nombre;
        titulo.textContent = item.nombre;
        precio.textContent = `$${parseFloat(item.precio).toFixed(2)}`; // Formatear precio

        // Estructurar elementos
        detallesDiv.appendChild(titulo);
        detallesDiv.appendChild(precio);
        itemDiv.appendChild(img);
        itemDiv.appendChild(detallesDiv);
        itemsContainer.appendChild(itemDiv);

        total += parseFloat(item.precio);
    });

    // Formatear el total con dos decimales
    document.getElementById('total-carrito').textContent = total.toFixed(3);
    modal.style.display = 'block';
}

// Cerrar carrito con botón
document.querySelector('.btn-cerrar').addEventListener('click', () => {
    document.getElementById('carrito-modal').style.display = 'none';
});

// Cerrar carrito al hacer clic fuera
window.addEventListener('click', (e) => {
    const modal = document.getElementById('carrito-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});