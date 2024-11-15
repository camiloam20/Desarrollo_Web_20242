// Función para verificar el estado de autenticación
function checkAuthStatus() {
    const username = localStorage.getItem('username');
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
          usernameElement.textContent = `Bienvenido, ${username}`;
        }
  }

document.addEventListener('DOMContentLoaded', checkAuthStatus);