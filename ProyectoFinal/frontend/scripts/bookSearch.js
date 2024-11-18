//frontend/scripts/bookSearch.js

// URL base para las peticiones API
const API_BASE_URL = 'http://localhost:3000/api/books';

// Elementos DOM
let searchBar = document.querySelector('.search-bar');
let searchBtn = document.querySelector('.search-btn');
const main = document.querySelector('main');
const hero = document.querySelector('.hero');
const searchBarContainer = document.querySelector('.search-bar-container');

// Crear contenedor de resultados
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
main.appendChild(searchResults);

// Crear elementos del popup
const popupOverlaybook = document.createElement('div');
popupOverlaybook.className = 'popup-overlaybook';
const bookPopup = document.createElement('div');
bookPopup.className = 'book-popup';
document.body.appendChild(popupOverlaybook);
document.body.appendChild(bookPopup);

// Variable para rastrear si estamos en modo búsqueda
let isSearchMode = false;

// Event listeners iniciales
searchBtn.addEventListener('click', () => {
    const query = searchBar.value.trim();
    if (query) {
        searchBooks(query);
    }
});

searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchBar.value.trim();
        if (query) {
            searchBooks(query);
        }
    }
});

// Función para entrar en modo búsqueda
function enterSearchMode() {
    if (!isSearchMode) {
        isSearchMode = true;
        main.classList.add('search-mode');
        
        // Mover la barra de búsqueda fuera del hero y mantener sus event listeners
        const searchBarContainerClone = searchBarContainer.cloneNode(true);
        main.insertBefore(searchBarContainerClone, searchResults);
        hero.style.display = 'none';
        
        // Actualizar las referencias a los elementos clonados
        const newSearchBar = searchBarContainerClone.querySelector('.search-bar');
        const newSearchBtn = searchBarContainerClone.querySelector('.search-btn');
        
        // Copiar el valor de la búsqueda anterior
        newSearchBar.value = searchBar.value;
        
        // Agregar event listeners a los nuevos elementos
        newSearchBtn.addEventListener('click', () => {
            const query = newSearchBar.value.trim();
            if (query) {
                searchBooks(query);
            }
        });

        newSearchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = newSearchBar.value.trim();
                if (query) {
                    searchBooks(query);
                }
            }
        });

        // Remover el contenedor original
        searchBarContainer.remove();
        
        // Actualizar las referencias globales
        searchBar = newSearchBar;
        searchBtn = newSearchBtn;
    }
}

// Función para mostrar el mensaje de carga
function displayLoadingMessage() {
    searchResults.innerHTML = `
        <div class="loading-container">
            <p class="loading">Buscando libros...</p>
        </div>
    `;
}

// Función para buscar libros
async function searchBooks(query) {
    try {
        enterSearchMode();
        displayLoadingMessage();
        
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        displayResults(data.docs);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        searchResults.innerHTML = `
        <div class="loading-container">
            <p class="loading">Error buscando libros. Por favor, intente de nuevo.</p>
        </div>
    `;
    }
}

// Función para mostrar resultados
function displayResults(books) {
    searchResults.innerHTML = '';
    
    if (books.length === 0) {
        searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }
    
    books.slice(0, 12).forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        const coverID = book.cover_i ? book.cover_i : '';
        const coverUrl = coverID ? 
            `https://covers.openlibrary.org/b/id/${coverID}-M.jpg` : 
            '../images/no-cover.png';

        card.innerHTML = `
            <img src="${coverUrl}" alt="Portada de ${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author_name ? book.author_name[0] : 'Autor desconocido'}</p>
            <p>${book.first_publish_year || 'Año desconocido'}</p>
        `;

        card.addEventListener('click', () => showBookDetails(book));
        searchResults.appendChild(card);
    });
}

// Función para generar las estrellas del rating
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


// Función para verificar el estado del libro para el usuario actual
async function checkBookStatus(bookId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/status/${bookId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el estado del libro');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al verificar estado del libro:', error);
        return null;
    }
}


// Función para mostrar detalles del libro actualizada
async function showBookDetails(book) {
    try {
        const workId = book.key.split('/')[2];
        const [details, ratingsData, readingStats, bookStatus] = await Promise.all([
            fetch(`https://openlibrary.org/works/${workId}.json`).then(res => res.json()),
            fetch(`https://openlibrary.org/works/${workId}/ratings.json`).then(res => res.json()),
            fetch(`https://openlibrary.org/works/${workId}/bookshelves.json`).then(res => res.json()),
            checkBookStatus(workId)
        ]);

        const coverID = book.cover_i || '';
        const coverUrl = coverID ? 
            `https://covers.openlibrary.org/b/id/${coverID}-L.jpg` : 
            '../images/no-cover.png';

        const rating = ratingsData.summary?.average || 0;
        const totalRatings = ratingsData.summary?.count || 0;
        const stars = generateStarRating(rating);

        const wantToRead = readingStats.counts?.want_to_read || 0;
        const currentlyReading = readingStats.counts?.currently_reading || 0;
        const hasRead = readingStats.counts?.already_read || 0;

        const bookData = {
            coverUrl,
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Desconocido',
            publisher: book.publisher ? book.publisher[0] : 'No especificado',
            pages: book.number_of_pages || 0,
            genre: book.subject ? book.subject[0] : 'No especificado',
            description: details.description ? 
                (typeof details.description === 'object' ? 
                    details.description.value : details.description) : 
                'Sin descripción'
        };

        bookPopup.innerHTML = `
            <button class="book-popup-close">&times;</button>
            <div class="book-popup-content">
                <div class="book-image">
                    <img src="${coverUrl}" alt="Portada de ${book.title}">
                    <div class="action-buttons">
                        <button class="favorite-btn ${bookStatus?.status === 'favourites' ? 'active' : ''}">
                            <i class="fas fa-heart"></i>
                            ${bookStatus?.status === 'favourites' ? 'En favoritos' : 'Añadir a favoritos'}
                        </button>
                        <div class="list-dropdown">
                            <button class="list-btn">
                                ${bookStatus?.status ? `En lista: ${bookStatus.status}` : 'Añadir a lista'}
                            </button>
                            <div class="list-options">
                                <button class="list-option" data-status="to-read">Quiero leer</button>
                                <button class="list-option" data-status="reading">Leyendo</button>
                                <button class="list-option" data-status="read">Leído</button>
                            </div>
                        </div>
                        <button class="review-btn">Dejar reseña</button>
                    </div>
                    <div class="book-stats">
                        <div class="rating-container">
                            <div class="stars">${stars}</div>
                            <p class="rating-count">${totalRatings} calificaciones</p>
                        </div>
                        <div class="reading-stats">
                            <div class="stat-item">
                                <i class="fas fa-list"></i>
                                <span>${wantToRead}</span>
                                <label>Quiero leer</label>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-book-reader"></i>
                                <span>${currentlyReading}</span>
                                <label>Leyendo</label>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-check"></i>
                                <span>${hasRead}</span>
                                <label>Leídos</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="book-details">
                    <h2>${book.title}</h2>
                    <p><strong>Autor:</strong> ${book.author_name ? book.author_name.join(', ') : 'Desconocido'}</p>
                    <p><strong>Año de publicación:</strong> ${book.first_publish_year || 'Desconocido'}</p>
                    <p><strong>Idiomas:</strong> ${book.language ? book.language.join(', ') : 'No especificado'}</p>
                    <p><strong>Editorial:</strong> ${book.publisher ? book.publisher[0] : 'No especificada'}</p>
                    <div class="book-description">
                        <h3>Descripción</h3>
                        <p>${bookData.description}</p>
                    </div>
                </div>
            </div>
            <div class="review-form" style="display: none;">
                <h3>Dejar reseña</h3>
                <div class="star-rating">
                    ${Array(5).fill().map((_, i) => 
                        `<i class="far fa-star" data-rating="${i + 1}"></i>`
                    ).join('')}
                </div>
                <textarea class="review-text" placeholder="Escribe tu reseña aquí..."></textarea>
                <button class="submit-review">Enviar reseña</button>
            </div>
        `;

        setupEventListeners(bookPopup, bookData);
        
        popupOverlaybook.classList.add('active');
        bookPopup.classList.add('active');
    } catch (error) {
        console.error('Error al obtener detalles del libro:', error);
    }
}

// Función para cerrar el popup
function closePopup() {
    popupOverlaybook.classList.remove('active');
    bookPopup.classList.remove('active');
}

// Función para mostrar el formulario de reseña
function showReviewForm(popup) {
    const reviewForm = popup.querySelector('.review-form');
    reviewForm.style.display = 'block';
}

// Función para ocultar el formulario de reseña
function hideReviewForm(popup) {
    const reviewForm = popup.querySelector('.review-form');
    reviewForm.style.display = 'none';
}

// Función para manejar la calificación con estrellas
function setupStarRating(popup) {
    const stars = popup.querySelectorAll('.star-rating .fa-star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            updateStarsDisplay(stars, rating);
        });

        star.addEventListener('mouseout', function() {
            updateStarsDisplay(stars, selectedRating);
        });

        star.addEventListener('click', function() {
            selectedRating = this.dataset.rating;
            updateStarsDisplay(stars, selectedRating);
        });
    });

    return () => selectedRating;
}

function updateStarsDisplay(stars, rating) {
    stars.forEach(star => {
        const starRating = star.dataset.rating;
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

async function addToList(bookData, status) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Por favor, inicia sesión para agregar libros a tu lista');
            window.location.href = '/login.html';
            return;
        }

        if (!token.trim()) {
            throw new Error('Token inválido');
        }

        const response = await fetch(`${API_BASE_URL}/add-to-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bookData,
                status,
                maintainFavorite: true  // Nueva bandera para mantener el estado de favoritos
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                window.location.href = '/login.html';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function submitReview(bookData, rating, review) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Por favor, inicia sesión para dejar una reseña');
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/add-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bookData,
                rating,
                review
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                window.location.href = '/login.html';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function handleReviewSubmission(bookData, rating, reviewText) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Por favor, inicia sesión para dejar una reseña');
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`${API_BASE_URL}/add-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bookData,
                rating,
                review: reviewText
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                window.location.href = '/login.html';
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para configurar los event listeners
function setupEventListeners(popup, bookData) {
    const closeBtn = popup.querySelector('.book-popup-close');
    const favBtn = popup.querySelector('.favorite-btn');
    const listBtn = popup.querySelector('.list-btn');
    const listDropdown = popup.querySelector('.list-dropdown');
    const listOptions = popup.querySelectorAll('.list-option');
    const reviewBtn = popup.querySelector('.review-btn');
    const submitReviewBtn = popup.querySelector('.submit-review');

    // Cerrar popup
    closeBtn.addEventListener('click', closePopup);
    popupOverlaybook.addEventListener('click', closePopup);

    // Configurar calificación con estrellas
    const getSelectedRating = setupStarRating(popup);


    // Manejar favoritos
    favBtn.addEventListener('click', async () => {
        try {
            const result = await addToList(bookData, 'favourites');
            if (result) {
                favBtn.classList.toggle('active');
                favBtn.innerHTML = favBtn.classList.contains('active') ?
                    '<i class="fas fa-heart"></i> En favoritos' :
                    '<i class="fas fa-heart"></i> Añadir a favoritos';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Manejar menú desplegable
    listBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const listOptions = popup.querySelector('.list-options');
        listOptions.style.display = listOptions.style.display === 'block' ? 'none' : 'block';
    });

    // Cerrar el menú desplegable cuando se hace clic fuera
    document.addEventListener('click', (e) => {
        if (!listDropdown.contains(e.target)) {
            popup.querySelector('.list-options').style.display = 'none';
        }
    });

    // Manejar opciones de lista
    listOptions.forEach(option => {
        option.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                const status = option.dataset.status;
                const result = await addToList(bookData, status);
                if (result) {
                    listBtn.textContent = `En lista: ${status}`;
                    popup.querySelector('.list-options').style.display = 'none';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });

    // Manejar botón de reseña
    reviewBtn.addEventListener('click', () => {
        const reviewForm = popup.querySelector('.review-form');
        if (reviewForm.style.display === 'none') {
            showReviewForm(popup);
        } else {
            hideReviewForm(popup);
        }
    });

    // Manejar envío de reseña
    submitReviewBtn.addEventListener('click', async () => {
        try {
            const rating = getSelectedRating();
            const reviewText = popup.querySelector('.review-text').value;

            if (!rating || !reviewText) {
                alert('Por favor, proporciona una calificación y una reseña');
                return;
            }

            const result = await handleReviewSubmission(bookData, rating, reviewText);
            if (result) {
                hideReviewForm(popup);
                // Mantener el estado de favoritos si existe
                if (!favBtn.classList.contains('active')) {
                    await addToList(bookData, 'read');
                    listBtn.textContent = 'En lista: read';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar la reseña. Por favor, inicia sesión.');
        }
    });
}
