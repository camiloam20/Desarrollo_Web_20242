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

  // Add form submission handlers
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
        // Store the token
        localStorage.setItem('token', result.token);
        
        // Close the popup
        overlay.remove();
        popup.remove();
        
        // Optional: Redirect to dashboard or refresh page
        window.location.reload();
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

// Event listeners para los botones
document.querySelectorAll('#login').forEach(btn => {
  btn.addEventListener('click', () => showPopup('login'));
});

document.querySelectorAll('#register').forEach(btn => {
  btn.addEventListener('click', () => showPopup('register'));
});

// Function to check if user is logged in
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    // Update UI for logged-in state
    document.querySelectorAll('#login, #register').forEach(btn => {
      btn.style.display = 'none';
    });
    
    // Add logout button if not exists
    if (!document.querySelector('#logout')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.id = 'logout';
      logoutBtn.classList.add('btn-nav');
      logoutBtn.textContent = 'Cerrar Sesión';
      logoutBtn.href = '#';
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.reload();
      });
      
      document.querySelector('.nav-buttons').appendChild(logoutBtn);
    }
  }
}

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);