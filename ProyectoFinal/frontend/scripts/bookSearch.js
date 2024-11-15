// Elementos DOM
const searchBar = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
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
        searchResults.innerHTML = '<p>Error al buscar libros. Por favor, intenta de nuevo.</p>';
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

// Función para mostrar detalles del libro
async function showBookDetails(book) {
    try {
        // Obtener detalles adicionales del libro
        const workId = book.key.split('/')[2];
        const response = await fetch(`https://openlibrary.org/works/${workId}.json`);
        const details = await response.json();
        
        // Obtener ratings
        const ratingsResponse = await fetch(`https://openlibrary.org/works/${workId}/ratings.json`);
        const ratingsData = await ratingsResponse.json();
        
        // Obtener estadísticas de lectura
        const readingStatsResponse = await fetch(`https://openlibrary.org/works/${workId}/bookshelves.json`);
        const readingStats = await readingStatsResponse.json();

        const coverID = book.cover_i ? book.cover_i : '';
        const coverUrl = coverID ? 
            `https://covers.openlibrary.org/b/id/${coverID}-L.jpg` : 
            '../images/no-cover.png';

        // Generar estrellas basado en el rating
        const rating = ratingsData.summary?.average || 0;
        const totalRatings = ratingsData.summary?.count || 0;
        const stars = generateStarRating(rating);

        // Obtener estadísticas de lectura
        const wantToRead = readingStats.counts?.want_to_read || 0;
        const currentlyReading = readingStats.counts?.currently_reading || 0;
        const hasRead = readingStats.counts?.already_read || 0;

        bookPopup.innerHTML = `
            <button class="book-popup-close">&times;</button>
            <div class="book-popup-content">
                <div class="book-image">
                    <img src="${coverUrl}" alt="Portada de ${book.title}">
                    <button class="favorite-btn">
                        <i class="fas fa-heart"></i>
                        Añadir a favoritos
                    </button>
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
                        <p>${details.description ? 
                            (typeof details.description === 'object' ? 
                                details.description.value : details.description) : 
                            'No hay descripción disponible'}</p>
                    </div>
                </div>
            </div>
        `;

        popupOverlaybook.classList.add('active');
        bookPopup.classList.add('active');

        // Eventos para cerrar el popup
        const closeBtn = bookPopup.querySelector('.book-popup-close');
        closeBtn.addEventListener('click', closePopup);
        popupOverlaybook.addEventListener('click', closePopup);

        // Evento para el botón de favoritos
        const favBtn = bookPopup.querySelector('.favorite-btn');
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            favBtn.innerHTML = `
                <i class="fas fa-heart" style="color: var(--secondary);"></i>
                Añadido a favoritos
            `;
            favBtn.disabled = true;
        });

    } catch (error) {
        console.error('Error al obtener detalles del libro:', error);
    }
}

// Función para cerrar el popup
function closePopup() {
    popupOverlaybook.classList.remove('active');
    bookPopup.classList.remove('active');
}

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