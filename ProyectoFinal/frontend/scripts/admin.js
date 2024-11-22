const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

const defaultOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
};

function createMainStructure() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <section id="users-section" class="admin-section">
            <h2>Gestión de Usuarios</h2>
            <div id="users-list" class="data-list"></div>
        </section>

        <section id="user-books-section" class="admin-section">
            <h2>Libros por Usuario</h2>
            <select id="user-select" class="admin-select">
                <option value="">Seleccione un usuario</option>
            </select>
            <div id="user-books-list" class="data-list"></div>
        </section>

        <section id="books-section" class="admin-section">
            <h2>Gestión de Libros</h2>
            <div id="books-list" class="data-list"></div>
        </section>

        <div id="modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="modal-body"></div>
            </div>
        </div>
    `;
}

const modal = {
    element: null,
    body: null,
    
    init() {
        this.element = document.getElementById('modal');
        this.body = document.getElementById('modal-body');
        
        const closeBtn = this.element.querySelector('.close');
        closeBtn.removeEventListener('click', this.hide);
        closeBtn.addEventListener('click', () => this.hide());
        
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) this.hide();
        });

        this.body.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },
    
    show(content) {
        this.body.innerHTML = content;
        this.element.style.display = 'block';
        this.element.style.pointerEvents = 'auto';
    },
    
    hide() {
        const modalElement = document.getElementById('modal');
        modalElement.style.display = 'none';
        modalElement.style.pointerEvents = 'none';
    }
};

/*Funcion para cargar todos los usuarios que estan en la tabla users de la base de datos.*/
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`, defaultOptions);
        const data = await response.json();

        const usersList = document.getElementById('users-list');
        usersList.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Año de Nacimiento</th>
                        <th>Admin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.data.map(user => `
                        <tr>
                            <td>${user.full_name}</td>
                            <td>${user.username}</td>
                            <td>${user.birth_year}</td>
                            <td>${user.is_admin ? 'Sí' : 'No'}</td>
                            <td>
                                <button onclick="showUserModal(${user.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        const userSelect = document.getElementById('user-select');
        userSelect.innerHTML = '<option value="">Seleccione un usuario</option>' +
            data.data.map(user => `
                <option value="${user.id}">${user.username} - ${user.full_name}</option>
            `).join('');
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

/*Funcion para mostrar un popUp con los datos de un usuario y poder modificarlos o eliminarlo de la base de datos.*/
async function showUserModal(userId) {
    try {
        const response = await fetch(`${API_URL}/admin/users`, defaultOptions);
        const data = await response.json();
        const user = data.data.find(u => u.id === userId);

        const modalContent = `
            <h3>Editar Usuario</h3>
            <form id="edit-user-form">
                <div class="form-group">
                    <label>Nombre Completo:</label>
                    <input type="text" name="full_name" value="${user.full_name}" required>
                </div>
                <div class="form-group">
                    <label>Nombre de Usuario:</label>
                    <input type="text" name="username" value="${user.username}" required>
                </div>
                <div class="form-group">
                    <label>Año de Nacimiento:</label>
                    <input type="number" name="birth_year" value="${user.birth_year}" required>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                    <button type="button" onclick="toggleAdminStatus(${userId})" class="btn-secondary">
                        ${user.is_admin ? 'Remover Admin' : 'Hacer Admin'}
                    </button>
                    <button type="button" onclick="deleteUser(${userId})" class="btn-danger">
                        Eliminar Usuario
                    </button>
                </div>
            </form>
        `;

        modal.show(modalContent);

        const form = document.getElementById('edit-user-form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateUser(userId, {
                full_name: e.target.full_name.value,
                username: e.target.username.value,
                birth_year: parseInt(e.target.birth_year.value)
            });
        };
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
    }
}

/*funcion para actualizar los datos de un usuario en la base de datos, correo y contraseña no.*/
async function updateUser(userId, userData) {
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            ...defaultOptions,
            method: 'PUT',
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            modal.hide();
            loadUsers();
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
}

/*Funcion para cambiar el estado de admin de un usuario.*/
async function toggleAdminStatus(userId) {
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-admin`, {
            ...defaultOptions,
            method: 'PUT'
        });

        if (response.ok) {
            modal.hide();
            loadUsers();
        }
    } catch (error) {
        console.error('Error al cambiar estado de admin:', error);
    }
}

/*Funcion para eliminar un usuario de la base de datos.*/
async function deleteUser(userId) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            ...defaultOptions,
            method: 'DELETE'
        });

        if (response.ok) {
            modal.hide();
            loadUsers();
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}

/*Funcion para cargar los libros que tiene un usuario en su lista de libros.*/
async function loadUserBooks(userId) {
    if (!userId) {
        document.getElementById('user-books-list').innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/books`, defaultOptions);
        const data = await response.json();

        document.getElementById('user-books-list').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Estado</th>
                        <th>Favorito</th>
                        <th>Calificación</th>
                        <th>Reseña</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.data.map(book => `
                        <tr>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.status}</td>
                            <td>${book.favourite ? 'Sí' : 'No'}</td>
                            <td>${book.rating || 'N/A'}</td>
                            <td>${book.review || 'Sin reseña'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al cargar libros del usuario:', error);
    }
}

/*Funcion para cargar todos los libros que estan en la tabla books de la base de datos. */
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/admin/books`, defaultOptions);
        const data = await response.json();

        document.getElementById('books-list').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Editorial</th>
                        <th>Género</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.data.map(book => `
                        <tr>
                            <td><img src="${book.image}" alt="${book.title}" class="book-thumbnail"></td>
                            <td>${book.title}</td>
                            <td>${book.author}</td>
                            <td>${book.publisher}</td>
                            <td>${book.genre}</td>
                            <td>
                                <button onclick="showBookModal(${book.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al cargar libros:', error);
    }
}

/*PopUp para modificar datos de los libros o eliminarlos de la base de datos.*/
async function showBookModal(bookId) {
    try {
        const response = await fetch(`${API_URL}/admin/books`, defaultOptions);
        const data = await response.json();
        const book = data.data.find(b => b.id === bookId);

        const modalContent = `
            <h3>Editar Libro</h3>
            <form id="edit-book-form">
                <div class="form-group">
                    <label>URL de la Imagen:</label>
                    <input type="text" name="image" value="${book.image}" required>
                </div>
                <div class="form-group">
                    <label>Título:</label>
                    <input type="text" name="title" value="${book.title}" required>
                </div>
                <div class="form-group">
                    <label>Autor:</label>
                    <input type="text" name="author" value="${book.author}" required>
                </div>
                <div class="form-group">
                    <label>Editorial:</label>
                    <input type="text" name="publisher" value="${book.publisher}" required>
                </div>
                <div class="form-group">
                    <label>Género:</label>
                    <input type="text" name="genre" value="${book.genre}" required>
                </div>
                <div class="form-group">
                    <label>Descripción:</label>
                    <textarea name="description" required>${book.description}</textarea>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                    <button type="button" onclick="deleteBook(${bookId})" class="btn-danger">
                        Eliminar Libro
                    </button>
                </div>
            </form>
        `;

        modal.show(modalContent);

        const form = document.getElementById('edit-book-form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateBook(bookId, {
                image: e.target.image.value,
                title: e.target.title.value,
                author: e.target.author.value,
                publisher: e.target.publisher.value,
                pages: 0,
                genre: e.target.genre.value,
                description: e.target.description.value
            });
        };
    } catch (error) {
        console.error('Error al cargar datos del libro:', error);
    }
}

async function updateBook(bookId, bookData) {
    try {
        const response = await fetch(`${API_URL}/admin/books/${bookId}`, {
            ...defaultOptions,
            method: 'PUT',
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            modal.hide();
            loadBooks();
        }
    } catch (error) {
        console.error('Error al actualizar libro:', error);
    }
}

async function deleteBook(bookId) {
    if (!confirm('¿Está seguro de que desea eliminar este libro? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/books/${bookId}`, {
            ...defaultOptions,
            method: 'DELETE'
        });

        if (response.ok) {
            modal.hide();
            loadBooks();
        }
    } catch (error) {
        console.error('Error al eliminar libro:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createMainStructure();
    modal.init();

    loadUsers();
    loadBooks();

    if (document.getElementById('logout')) {
        document.getElementById('logout').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('isAdmin');
          window.location.href = '/index.html';
        });
      }

    document.getElementById('user-select').addEventListener('change', (e) => {
        loadUserBooks(e.target.value);
    });
}); 

window.showUserModal = showUserModal;
window.toggleAdminStatus = toggleAdminStatus;
window.deleteUser = deleteUser;
window.showBookModal = showBookModal;
window.deleteBook = deleteBook;
window.modal = modal;