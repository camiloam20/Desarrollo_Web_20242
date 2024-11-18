document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticación
  const token = localStorage.getItem('token');
  if (!token) {
      console.log('No token found, redirecting to login');
      window.location.href = '/login.html';
      return;
  }

  const username = localStorage.getItem('username');
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
          usernameElement.textContent = `Bienvenido, ${username}`;
        }

  try {
      // Inicializar la interfaz
      const main = document.querySelector('main');
      if (!main) {
          throw new Error('Main element not found in DOM');
      }

      const listsContainer = document.createElement('div');
      listsContainer.className = 'lists-container';
      main.appendChild(listsContainer);

      // Crear elementos del popup
      console.log('Creating popup elements...');
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      const bookPopup = document.createElement('div');
      bookPopup.className = 'book-popup';
      
      // Asegurarse de que el overlay y popup estén inicialmente ocultos
      popupOverlay.classList.remove('active');
      bookPopup.classList.remove('active');
      
      document.body.appendChild(popupOverlay);
      document.body.appendChild(bookPopup);

      // Cargar las listas
      console.log('Loading reading lists...');
      await loadReadingLists();

      // Agregar manejadores de eventos globales para el popup
      popupOverlay.addEventListener('click', closePopup);
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              closePopup();
          }
      });

  } catch (error) {
      console.error('Error during initialization:', error);
      showError('Error al inicializar la página');
  }
});

async function loadReadingLists() {
  try {
      const token = localStorage.getItem('token');
      console.log('Fetching lists data...');
      
      const response = await fetch('http://localhost:3000/api/books/lists', {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Server error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format received from server');
      }

      displayLists(data);
  } catch (error) {
      console.error('Error in loadReadingLists:', error);
      showError('Error al cargar las listas de lectura');
  }
}


function displayLists(data) {
  try {
      console.log('Displaying lists...');
      const listsContainer = document.querySelector('.lists-container');
      if (!listsContainer) {
          throw new Error('Lists container not found');
      }

      listsContainer.innerHTML = `
          <p>Encuentra aquí tus libros favoritos y tus listas personales.</p>
          <div class="lists-grid">
              <div class="list-section" id="favourites">
                  <h2>Favoritos</h2>
                  <div class="books-grid"></div>
              </div>
              <div class="list-section" id="reading">
                  <h2>Leyendo</h2>
                  <div class="books-grid"></div>
              </div>
              <div class="list-section" id="to-read">
                  <h2>Quiero leer</h2>
                  <div class="books-grid"></div>
              </div>
              <div class="list-section" id="read">
                  <h2>Leído</h2>
                  <div class="books-grid"></div>
              </div>
          </div>
      `;

      // Mostrar libros en cada sección
      Object.keys(data).forEach(status => {
          const booksGrid = document.querySelector(`#${status} .books-grid`);
          if (!booksGrid) {
              console.error(`Grid not found for status: ${status}`);
              return;
          }

          if (!Array.isArray(data[status]) || data[status].length === 0) {
              booksGrid.innerHTML = '<p class="empty-list">No hay libros en esta lista</p>';
              return;
          }

          console.log(`Displaying books for ${status}:`, data[status].length);
          data[status].forEach(book => {
              const card = createBookCard(book);
              booksGrid.appendChild(card);
          });
      });
  } catch (error) {
      console.error('Error in displayLists:', error);
      showError('Error al mostrar las listas');
  }
}

function createBookCard(book) {
  try {
      const card = document.createElement('div');
      card.className = 'book-card';
      
      const coverUrl = book.image || '../images/no-cover.png';
      
      card.innerHTML = `
          <img src="${coverUrl}" alt="Portada de ${book.title}" 
               onerror="this.src='../images/no-cover.png'">
          <h3>${book.title || 'Sin título'}</h3>
          <p>${book.author || 'Autor desconocido'}</p>
      `;

      card.addEventListener('click', () => showBookDetails(book));
      return card;
  } catch (error) {
      console.error('Error creating book card:', error);
      return createErrorCard();
  }
}

function createErrorCard() {
  const card = document.createElement('div');
  card.className = 'book-card error';
  card.innerHTML = `
      <div class="error-message">
          Error al cargar el libro
      </div>
  `;
  return card;
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  
  const main = document.querySelector('main');
  if (main) {
      main.prepend(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
  }
}

// Función para mostrar detalles del libro
function showBookDetails(book) {
  const bookPopup = document.querySelector('.book-popup');
  const popupOverlay = document.querySelector('.popup-overlay');

  const stars = book.rating ? generateStarRating(book.rating) : '';

  bookPopup.innerHTML = `
      <button class="book-popup-close">&times;</button>
      <div class="book-popup-content">
          <div class="book-image">
              <img src="${book.image || '../images/no-cover.png'}" alt="Portada de ${book.title}">
              <div class="action-buttons">
                  ${book.status === 'favourites' ? `
                      <button class="remove-favorite-btn">
                          <i class="fas fa-heart-broken"></i>
                          Eliminar de favoritos
                      </button>
                  ` : `
                      <button class="remove-list-btn">
                          <i class="fas fa-times"></i>
                          Eliminar de la lista
                      </button>
                  `}
              </div>
          </div>
          <div class="book-details">
              <h2>${book.title}</h2>
              <p><strong>Autor:</strong> ${book.author}</p>
              <p><strong>Editorial:</strong> ${book.publisher}</p>
              <p><strong>Género:</strong> ${book.genre}</p>
              <p><strong>Páginas:</strong> ${book.pages}</p>
              <div class="book-description">
                  <h3>Descripción</h3>
                  <p>${book.description}</p>
              </div>
              ${book.review ? `
                  <div class="book-review">
                      <h3>Tu reseña</h3>
                      <div class="stars">${stars}</div>
                      <p>${book.review}</p>
                      <button class="delete-review-btn">Eliminar reseña</button>
                  </div>
              ` : ''}
          </div>
      </div>
  `;

  setupPopupEventListeners(bookPopup, book);
  
  popupOverlay.classList.add('active');
  bookPopup.classList.add('active');
}

// Función para generar el rating con estrellas
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return `
      ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
      ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
      ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
  `;
}

// Función para configurar event listeners del popup
function setupPopupEventListeners(popup, book) {
  const closeBtn = popup.querySelector('.book-popup-close');
  const removeFavBtn = popup.querySelector('.remove-favorite-btn');
  const removeListBtn = popup.querySelector('.remove-list-btn');
  const deleteReviewBtn = popup.querySelector('.delete-review-btn');

  if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closePopup();
      });
  }

  if (removeFavBtn) {
      removeFavBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await removeFromFavorites(book.id);
      });
  }

  if (removeListBtn) {
      removeListBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await removeFromList(book.id);
      });
  }

  if (deleteReviewBtn) {
      deleteReviewBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          await deleteReview(book.id);
      });
  }
}

// Función para cerrar el popup
function closePopup() {
    const popupOverlay = document.querySelector('.popup-overlay');
    const bookPopup = document.querySelector('.book-popup');
    
    if (popupOverlay) {
        popupOverlay.classList.remove('active');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300); // Esperar a que termine la transición
    }
    
    if (bookPopup) {
        bookPopup.classList.remove('active');
        setTimeout(() => {
            bookPopup.innerHTML = '';
        }, 300);
    }
}

// Funciones para interactuar con el backend
async function removeFromFavorites(bookId) {
  try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/books/remove-favorite/${bookId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          closePopup();
          loadReadingLists();
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

async function removeFromList(bookId) {
  try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/books/remove-from-list/${bookId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          closePopup();
          loadReadingLists();
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

async function deleteReview(bookId) {
  try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/books/delete-review/${bookId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          closePopup();
          loadReadingLists();
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

