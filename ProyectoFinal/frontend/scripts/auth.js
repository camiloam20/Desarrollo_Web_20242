function showPopup(type) {
  const overlay = document.createElement('div');
  overlay.classList.add('popup-overlay');
  document.body.appendChild(overlay);

  const popup = document.createElement('div');
  popup.classList.add('popup-container');

  const form = document.createElement('form');
  form.classList.add('popup-form');
  form.id = type === 'register' ? 'registerForm' : 'loginForm';

  if (type === 'register') {
    form.innerHTML = `
      <h2>Únete a BookNest</h2>
      <input type="text" name="fullName" placeholder="Nombre Completo" required>
      <input type="text" name="username" placeholder="Nombre de Usuario" required>
      <input type="email" name="email" placeholder="Correo Electrónico" required>
      <input type="password" name="password" placeholder="Contraseña" required>
      <input type="date" name="birthDate" required>
      <button type="submit">Registrarse</button>
      <div class="error-message" style="display: none; color: red;"></div>
    `;
  } else {
    form.innerHTML = `
      <h2>Iniciar Sesión</h2>
      <input type="email" name="email" placeholder="Correo Electrónico" required>
      <input type="password" name="password" placeholder="Contraseña" required>
      <button type="submit">Iniciar Sesión</button>
      <div class="error-message" style="display: none; color: red;"></div>
    `;
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('popup-close');
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', () => {
    overlay.remove();
    popup.remove();
  });

  popup.appendChild(form);
  popup.appendChild(closeButton);
  document.body.appendChild(popup);

  // Añadir manejadores de envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const errorDiv = form.querySelector('.error-message');

    try {
      const response = await fetch(`http://localhost:3000/api/auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Almacenar el token y los datos del usuario
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.username);
        localStorage.setItem('isAdmin', result.isAdmin || false);
        
        // Cerrar el popup
        overlay.remove();
        popup.remove();
        
        // Redirigir basado en el rol del usuario
        if (result.isAdmin) {
          window.location.href = '/pages/admin.html';
        } else {
          window.location.href = '/pages/dashboard.html';
        }
      } else {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
      }
    } catch (error) {
      errorDiv.textContent = 'Error en la conexión con el servidor';
      errorDiv.style.display = 'block';
    }
  });
}

// Listeners para los botones
document.querySelectorAll('#login').forEach(btn => {
  btn.addEventListener('click', () => showPopup('login'));
});

document.querySelectorAll('#register').forEach(btn => {
  btn.addEventListener('click', () => showPopup('register'));
});

// Función para verificar el estado de autenticación
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const currentPath = window.location.pathname;
  
  // Si estamos en el dashboard o en la página de admin
  if (currentPath.includes('dashboard.html') || currentPath.includes('admin.html')) {
    if (!token) {
      // Si no hay token, redirigir al index
      window.location.href = '/index.html';
    } else {
      // Verificar acceso a la página de admin
      if (currentPath.includes('admin.html') && !isAdmin) {
        window.location.href = '/pages/dashboard.html';
      } else if (currentPath.includes('dashboard.html') && isAdmin) {
        window.location.href = '/pages/admin.html';
      }
      // Si hay token, actualizar el nombre de usuario
      const usernameElement = document.getElementById('username');
      if (usernameElement) {
        usernameElement.textContent = `Bienvenido, ${username}`;
      }
    }
  }
}

// Manejar el cierre de sesión
if (document.getElementById('logout')) {
  document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    window.location.href = '/index.html';
  });
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuthStatus);
