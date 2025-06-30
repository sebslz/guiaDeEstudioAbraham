// Función para obtener productos de la API
async function obtenerProductos() {
    try {
        const response = await fetch('http://localhost:8000/productos');
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        document.getElementById('productos-container').innerHTML = '<p>Error al cargar productos</p>';
    }
}

// Función para mostrar productos en HTML
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    
    // ¿Qué crees que hace este código?
    let html = '<table border="1"><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Descripción</th></tr>';
    
    productos.forEach(producto => {
        html += `<tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.descripcion}</td>
                </tr>`;
    });
    
    html += '</table>';
    container.innerHTML = html;
}

// Llamar la función cuando cargue la página
window.onload = obtenerProductos;