// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Referencias a elementos del DOM
const userName = document.getElementById('userName');
const userDetails = document.getElementById('userDetails');
const logoutBtn = document.getElementById('logoutBtn');
const getUserBtn = document.getElementById('getUserBtn');
const testApiBtn = document.getElementById('testApiBtn');
const apiResponse = document.getElementById('apiResponse');

// Event listeners
logoutBtn.addEventListener('click', handleLogout);
getUserBtn.addEventListener('click', getUserData);
testApiBtn.addEventListener('click', testProtectedApi);

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', initDashboard);

// Inicializar dashboard
function initDashboard() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token) {
        // No hay token, redirigir al login
        redirectToLogin();
        return;
    }
    
    if (userData) {
        // Mostrar datos del usuario guardados
        const user = JSON.parse(userData);
        displayUserInfo(user);
    }
}

// Mostrar información del usuario
function displayUserInfo(user) {
    userName.textContent = user.name;
    userDetails.innerHTML = `
        <p><strong>Nombre:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Sesión iniciada:</strong> ${new Date().toLocaleString()}</p>
    `;
}

// Obtener datos del usuario desde la API
async function getUserData() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        redirectToLogin();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            displayApiResponse(`Datos obtenidos: ${JSON.stringify(userData, null, 2)}`, 'success');
        } else if (response.status === 401) {
            // Token expirado o inválido
            handleTokenExpired();
        } else {
            displayApiResponse('Error al obtener datos del usuario', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        displayApiResponse('Error de conexión', 'error');
    }
}

// Probar API protegida (ejemplo adicional)
async function testProtectedApi() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        redirectToLogin();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            displayApiResponse('✅ API protegida funciona correctamente', 'success');
        } else if (response.status === 401) {
            handleTokenExpired();
        } else {
            displayApiResponse('❌ Error en API protegida', 'error');
        }
        
    } catch (error) {
        displayApiResponse('❌ Error de conexión con API', 'error');
    }
}

// Cerrar sesión
async function handleLogout() {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
        try {
            // Llamar al endpoint de logout
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }
    
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Redirigir al login
    redirectToLogin();
}

// Manejar token expirado
function handleTokenExpired() {
    alert('Tu sesión ha expirado. Serás redirigido al login.');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    redirectToLogin();
}

// Redirigir al login
function redirectToLogin() {
    window.location.href = 'index.html';
}

// Mostrar respuesta de API
function displayApiResponse(message, type) {
    apiResponse.textContent = message;
    apiResponse.className = `api-response ${type}`;
}