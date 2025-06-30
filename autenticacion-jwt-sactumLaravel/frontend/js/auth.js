// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

console.log('🚀 auth.js cargado correctamente');

// Referencias a elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

console.log('📋 Elementos DOM:', {
    loginForm,
    emailInput,
    passwordInput,
    loginBtn,
    messageDiv
});

// Event listener para el formulario
loginForm.addEventListener('submit', handleLogin);

// Función principal de login
async function handleLogin(event) {
    console.log('🔥 ¡handleLogin se ejecutó!');
    event.preventDefault(); // Evita que se recargue la página
    
    // Obtener datos del formulario
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    console.log('📧 Email:', email);
    console.log('🔒 Password:', password);
    
    // Validaciones básicas
    if (!email || !password) {
        showMessage('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Deshabilitar botón mientras se procesa
    setLoadingState(true);
    
    try {
        // Hacer petición al backend
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login exitoso
            handleLoginSuccess(data);
        } else {
            // Error de autenticación
            handleLoginError(data);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Verifica que el backend esté funcionando.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Manejar login exitoso
function handleLoginSuccess(data) {
    // Guardar token en localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    showMessage('¡Login exitoso! Redirigiendo...', 'success');
    
    // Redirigir al dashboard después de 1 segundo
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// Manejar errores de login
function handleLoginError(data) {
    const message = data.message || 'Error desconocido';
    showMessage(message, 'error');
}

// Mostrar mensajes al usuario
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
}

// Controlar estado de carga del botón
function setLoadingState(isLoading) {
    loginBtn.disabled = isLoading;
    loginBtn.textContent = isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión';
}

// Verificar si ya hay una sesión activa
function checkExistingSession() {
    const token = localStorage.getItem('auth_token');
    if (token) {
        // Si ya hay token, redirigir al dashboard
        window.location.href = 'dashboard.html';
    }
}

// Ejecutar verificación al cargar la página
document.addEventListener('DOMContentLoaded', checkExistingSession);