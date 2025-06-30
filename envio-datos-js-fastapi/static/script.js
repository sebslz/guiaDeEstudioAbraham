document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('producto-form');
    const cargarBtn = document.getElementById('cargar-productos');
    const productosLista = document.getElementById('productos-lista');

    // Enviar producto al servidor
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const producto = {
            nombre: formData.get('nombre'),
            precio: parseFloat(formData.get('precio')),
            descripcion: formData.get('descripcion')
        };

        // TU TAREA: Completar el fetch POST
        try {
            const response = await fetch('/productos', {
                method: 'POST',
                headers: {
                     'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (response.ok) {
                const nuevoProducto = await response.json();
                alert('Producto agregado: ' + nuevoProducto.nombre);
                form.reset();
                cargarProductos(); // Recargar la lista
            } else {
                alert('Error al agregar producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    });

    // TU TAREA: Completar la función para cargar productos
    async function cargarProductos() {
        try {
            const response = await fetch('/productos');
            const productos = await response.json();
            
            // Mostrar productos en el HTML
            mostrarProductos(productos);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función para mostrar productos (ya completa)
    function mostrarProductos(productos) {
        productosLista.innerHTML = '';
        productos.forEach(producto => {
            const div = document.createElement('div');
            div.className = 'producto-item';
            div.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>Descripción: ${producto.descripcion}</p>
            `;
            productosLista.appendChild(div);
        });
    }

    // Botón para cargar productos
    cargarBtn.addEventListener('click', cargarProductos);
});