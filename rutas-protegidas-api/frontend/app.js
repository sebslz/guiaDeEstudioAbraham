// Configuración de la API
const API_BASE_URL = 'http://localhost:8000';

// Variables globales para manejar el estado
let currentToken = null;

// Elementos del DOM
const loginSection = document.getElementById('login-section');
const perfilSection = document.getElementById('perfil-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const refreshPerfilBtn = document.getElementById('refresh-perfil-btn');
const statusInfo = document.getElementById('status-info');
const perfilInfo = document.getElementById('perfil-info');
const messagesDiv = document.getElementById('messages');

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messagesDiv.appendChild(messageDiv);
    
    // Eliminar mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Función para actualizar el estado visual de la sesión
function updateSessionStatus(isAuthenticated, username = null) {
    if (isAuthenticated) {
        statusInfo.textContent = `✅ Autenticado como: ${username}`;
        statusInfo.className = 'success';
        loginSection.classList.add('hidden');
        perfilSection.classList.remove('hidden');
    } else {
        statusInfo.textContent = '❌ No autenticado';
        statusInfo.className = 'error';
        loginSection.classList.remove('hidden');
        perfilSection.classList.add('hidden');
        perfilInfo.innerHTML = '';
    }
}

// Función para hacer login
async function login(username, password) {
    try {
        showMessage('Iniciando sesión...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error en el login');
        }

        const data = await response.json();
        
        // Guardar el token
        currentToken = data.access_token;
        
        showMessage('¡Login exitoso!', 'success');
        updateSessionStatus(true, username);
        
        // Cargar el perfil automáticamente
        await loadPerfil();
        
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
        console.error('Error en login:', error);
    }
}

// Función para cargar datos del perfil (RUTA PROTEGIDA)
async function loadPerfil() {
    try {
        showMessage('Cargando perfil...', 'info');
        
        // ⚠️ PARTE CRÍTICA: Enviar el token JWT en el header Authorization
        const response = await fetch(`${API_BASE_URL}/perfil`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expirado o inválido
                showMessage('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
                logout();
                return;
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const userData = await response.json();
        
        // Mostrar datos del perfil en la interfaz
        perfilInfo.innerHTML = `
            <h3>Información del Perfil:</h3>
            <p><strong>👤 Usuario:</strong> ${userData.username}</p>
            <p><strong>📧 Email:</strong> ${userData.email}</p>
            <p><strong>📝 Nombre completo:</strong> ${userData.full_name || 'No especificado'}</p>
            <p><strong>🕒 Última actualización:</strong> ${new Date().toLocaleString()}</p>
        `;
                showMessage('Perfil cargado correctamente', 'success');
        
    } catch (error) {
        showMessage(`Error al cargar perfil: ${error.message}`, 'error');
        console.error('Error cargando perfil:', error);
    }
}

// Función para cerrar sesión
function logout() {
    currentToken = null;
    updateSessionStatus(false);
    showMessage('Sesión cerrada', 'info');
}

// Eventos del DOM
document.addEventListener('DOMContentLoaded', function() {
    // Evento del formulario de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showMessage('Por favor completa todos los campos', 'error');
            return;
        }
        
        await login(username, password);
    });
    
    // Evento del botón de logout
    logoutBtn.addEventListener('click', function() {
        logout();
    });
    
    // Evento para actualizar perfil
    refreshPerfilBtn.addEventListener('click', async function() {
        if (!currentToken) {
            showMessage('No hay sesión activa', 'error');
            return;
        }
        await loadPerfil();
    });
    
    // Estado inicial
    updateSessionStatus(false);
});
        