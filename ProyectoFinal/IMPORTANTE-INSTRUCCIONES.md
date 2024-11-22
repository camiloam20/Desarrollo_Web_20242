# BookNest:

Desarrollé el proyecto para que se tengan 2 alternativas, poder usarlo como un usuario común o como un administrador. 

- El usuario común se registra y sus datos quedan guardados en la base de datos de sql, puede iniciar sesión y tendrá 2 páginas. La primera "explorar libros", se puede buscar el título de un libro en específico o de un autor y se verá una lista de libros (se realiza búsqueda a la API de OpenLibrary). Si se clickea en un libro, se mostrará una pantalla con múltiples detalles del libro y las opciones de "añadir a favoritos" "añadir a lista" y "dejar reseña". Todas estas funcionalidades hacen que, a través de los endpoint del backend, se guarden los libros en la base de datos. 

#En la base de datos ya esta creado un usuario con libros en favoritos, listas y con reseña. Correo: camiloam20@gmail.com y contraseña: Contraseña.




# BookNest - Documentación de Endpoints

## Autenticación (`/api/auth`)

### POST `/api/auth/register`
- **Descripción**: Registra un nuevo usuario en el sistema
- **Método**: POST
- **DB**: Crea nuevo documento en colección `users`

### POST `/api/auth/login`
- **Descripción**: Inicia sesión de usuario
- **Método**: POST
- **DB**: Consulta colección `users` para validar credenciales

## Libros (`/api/books`)
*Todas estas rutas requieren autenticación*

### POST `/api/books/add-to-list`
- **Descripción**: Añade un libro a la lista del usuario
- **Método**: POST
- **DB**: Actualiza array `books` en documento de usuario

### POST `/api/books/add-review`
- **Descripción**: Añade una reseña a un libro
- **Método**: POST
- **DB**: Crea documento en colección `reviews`

### GET `/api/books/lists`
- **Descripción**: Obtiene las listas de libros del usuario
- **Método**: GET
- **DB**: Consulta colección `users` y hace populate de `books`

### POST `/api/books/add-favorites/:bookId`
- **Descripción**: Añade un libro a favoritos
- **Método**: POST
- **DB**: Actualiza array `favorites` en documento de usuario

### DELETE `/api/books/remove-favorite/:bookId`
- **Descripción**: Elimina un libro de favoritos
- **Método**: DELETE
- **DB**: Actualiza array `favorites` en documento de usuario

### DELETE `/api/books/remove-from-list/:bookId`
- **Descripción**: Elimina un libro de la lista del usuario
- **Método**: DELETE
- **DB**: Actualiza array `books` en documento de usuario

### DELETE `/api/books/delete-review/:bookId`
- **Descripción**: Elimina una reseña de un libro
- **Método**: DELETE
- **DB**: Elimina documento de colección `reviews`

## Administración (`/api/admin`)
*Todas las rutas requieren autenticación y permisos de administrador*

### Gestión de Usuarios

#### GET `/api/admin/users`
- **Descripción**: Obtiene lista de todos los usuarios
- **Método**: GET
- **DB**: Consulta colección `users`

#### GET `/api/admin/users/:userId/books`
- **Descripción**: Obtiene los libros de un usuario específico
- **Método**: GET
- **DB**: Consulta documento específico en `users` y hace populate de `books`

#### PUT `/api/admin/users/:userId`
- **Descripción**: Actualiza información de usuario
- **Método**: PUT
- **DB**: Actualiza documento en colección `users`

#### DELETE `/api/admin/users/:userId`
- **Descripción**: Elimina un usuario
- **Método**: DELETE
- **DB**: Elimina documento de colección `users`

#### PUT `/api/admin/users/:userId/toggle-admin`
- **Descripción**: Activa/desactiva permisos de administrador
- **Método**: PUT
- **DB**: Actualiza campo `isAdmin` en documento de usuario

### Gestión de Libros

#### GET `/api/admin/books`
- **Descripción**: Obtiene lista de todos los libros
- **Método**: GET
- **DB**: Consulta colección `books`

#### PUT `/api/admin/books/:bookId`
- **Descripción**: Actualiza información de un libro
- **Método**: PUT
- **DB**: Actualiza documento en colección `books`

#### DELETE `/api/admin/books/:bookId`
- **Descripción**: Elimina un libro
- **Método**: DELETE
- **DB**: Elimina documento de colección `books`