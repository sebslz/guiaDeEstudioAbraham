// 1. Esperar a que el HTML se cargue completamente
document.addEventListener('DOMContentLoaded', function () {

    // 2. Capturar elementos del DOM
    const form = document.getElementById('userForm');
    const responseDiv = document.getElementById('response');
    const submitBtn = document.getElementById('submitBtn');

    // 3. Interceptar el evento submit del formulario
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // ← CRÍTICO: Evita que se recargue la página

        // 4. Obtener los datos del formulario
        const formData = new FormData(form);
        const userData = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            edad: formData.get('edad')
        };

        // 5. Mostrar que está cargando
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        responseDiv.style.display = 'none';

        try {
            console.log('🚀 Enviando datos:', userData);
            // 6. AQUÍ ESTÁ EL FETCH API - La parte importante
            const response = await fetch('http://127.0.0.1:8000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            console.log('📡 Respuesta recibida:', response);

            // 7. Convertir la respuesta a JSON
            const data = await response.json();
            console.log('📦 Datos JSON:', data);

            // 8. Verificar si fue exitoso
            if (response.ok) {
                // ✅ ÉXITO
                console.log('✅ Éxito!');
                showResponse('success', `
                    <h3>¡Usuario creado exitosamente!</h3>
                    <p><strong>ID:</strong> ${data.data.id}</p>
                    <p><strong>Nombre:</strong> ${data.data.nombre}</p>
                    <p><strong>Email:</strong> ${data.data.email}</p>
                    <p><strong>Edad:</strong> ${data.data.edad}</p>
                    <p><strong>Fecha:</strong> ${data.data.created_at}</p>
                `);
                form.reset(); // Limpiar formulario
            } else {
                console.log('❌ Error del servidor');
                // ❌ ERROR del servidor
                showResponse('error', `
                    <h3>Error del servidor</h3>
                    <p>${data.message || 'Error desconocido'}</p>
                `);
            }

        } catch (error) {
            // ❌ ERROR de conexión
            console.log('💥 Error de conexión:', error);
            showResponse('error', `
                <h3>Error de conexión</h3>
                <p>No se pudo conectar con el servidor: ${error.message}</p>
            `);
        } finally {
            // 9. Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrar Usuario';
        }
    });

    // Función auxiliar para mostrar respuestas
    function showResponse(type, message) {
        responseDiv.className = `response-area ${type}`;
        responseDiv.innerHTML = message;
        responseDiv.style.display = 'block';
    }
});