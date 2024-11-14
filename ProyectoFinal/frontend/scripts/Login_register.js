// Archivo: scripts/login-register-popup.js

// Función para mostrar la ventana popup
function showPopup(type) {
    // Crear el fondo oscuro difuminado
    const overlay = document.createElement('div');
    overlay.classList.add('popup-overlay');
    document.body.appendChild(overlay);
  
    // Crear el contenedor de la ventana popup
    const popup = document.createElement('div');
    popup.classList.add('popup-container');
  
    // Crear el formulario de registro o login
    const form = document.createElement('form');
    form.classList.add('popup-form');
  
    if (type === 'register') {
      form.innerHTML = `
        <h2>Unete a BookNest</h2>
        <input type="text" placeholder="Nombre Completo" required>
        <input type="text" placeholder="Nombre de Usuario" required>
        <input type="email" placeholder="Correo Electrónico" required>
        <input type="password" placeholder="Contraseña" required>
        <input type="date" placeholder="Fecha de Nacimiento" required>
        <button type="submit">Registrarse</button>
      `;
    } else {
      form.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <input type="email" placeholder="Correo Electrónico" required>
        <input type="password" placeholder="Contraseña" required>
        <button type="submit">Iniciar Sesión</button>
      `;
    }
  
    // Agregar los event listeners para cerrar la ventana popup
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
  }
  
  // Agregar los event listeners a los botones de la página
  document.querySelectorAll('#login').forEach(btn => {
    btn.addEventListener('click', () => showPopup('login'));
  });
  
  document.querySelectorAll('#register').forEach(btn => {
    btn.addEventListener('click', () => showPopup('register'));
  });