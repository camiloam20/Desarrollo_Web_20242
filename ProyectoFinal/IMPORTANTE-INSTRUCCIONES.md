# BookNest: Funcionamiento

El archivo `start_project.sh` permite ejecutar directamente los contenedores ( docker-compose ) y tambien abrir el proyecto en el navegador predeterminado (cambiar lineas del archivo si es windows o linux).
 - La pagina está montada sobre http://localhost:8080/
 - El backend está en http://localhost:3000/
 - Se puede visualizar la base de datos en tiempo real en http://localhost:8081/ con Adminer, usar las siguientes credenciales:
    Sistema: MySQL
    Servidor: db
    Usuario: root 
    Contraseña: password_db
    Base de datos: db_booknest

**IMPORTANTE:** El contenedor de la  base de datos usualmente suele tardar 1 o casi 2 minutos más en iniciar a comparación del frontend por lo que si se intenta iniciar sesión rapidamente la interfaz nos indicará que hay un error de conexión, solo basta con esperar ese minuto e iniciar sesión o registrarse sin problemas.

 ## Desarrollé el proyecto para que se tengan 2 alternativas, poder usarlo como un usuario común o como un administrador.
 ### En la base de datos ya está creado un usuario con libros en favoritos, listas y con reseñas. Correo: camiloam20@gmail.com y su contraseña: contraseña
### El correo del administrador es: admin@booknest.com y su contraseña: admin12345

 El usuario común se registra y sus datos quedan guardados en la base de datos de sql, puede iniciar sesión y tendrá 2 páginas. La primera "explorar libros", se puede buscar el título de un libro en específico o de un autor y se verá una lista de libros (se realiza búsqueda a la API de OpenLibrary). Si se clickea en un libro, se mostrará una pantalla con múltiples detalles del libro y las opciones de "añadir a favoritos" "añadir a lista" y "dejar reseña". Todas estas funcionalidades hacen que, a través de los endpoint del backend, se guarden los libros en la base de datos.

 Por defecto, solo existe un administrador en el sistema. Al ingresar como administrador, tienes la posibilidad de ver todos los usuarios que existen. Se puede modificar su información como nombre completo, nombre de usuario o fecha de nacimiento y se les puede hacer administrador, así como se puede eliminar usuario de la base de datos. El administrador tambien puede visualizar en una lista qué libros tiene cada usuario guardados en listas, así como las calificaciones, reseñas y favoritos. Y por último, el administrador puede visualizar todos los libros que se encuentran almacenados en la base de datos, puede eliminarlos o modificar toda su información.



## BookNest - Documentación de Endpoints
Estos son todos los endpoints que construí en el proyecto, algunos de estos tienen implementado jwt asi como brycript y otras funcionalidades

### 1. **Autenticación** (`/api/auth`):
#### POST `/api/auth/register`
-  **Descripción**: Registra un nuevo usuario en el sistema
-  **Método**: POST
-  **DB**: Crea nuevo documento en colección `users`

#### POST `/api/auth/login`
-  **Descripción**: Inicia sesión de usuario
-  **Método**: POST
-  **DB**: Consulta colección `users` para validar credenciales

### 2. Libros (`/api/books`):

*Todas estas rutas requieren iniciar sesión y tener token. Estas son para las funcionalidades de un usuario común.*

#### POST `/api/books/add-to-list`
-  **Descripción**: Añade un libro a la lista del usuario.
-  **Método**: POST
-  **DB**: Añade un elemento a la tabla  `books` y la tabla `user_books`.
- 
#### POST `/api/books/add-review`
-  **Descripción**: Añade una reseña a un libro.
-  **Método**: POST
-  **DB**: Crea un elemento en el campo`review`.
- 
#### GET `/api/books/lists`
-  **Descripción**: Obtiene las listas de libros del usuario.
-  **Método**: GET
-  **DB**: Consulta la tabla `user_books` y trae todos los elementos relacionados con el usuario.

#### POST `/api/books/add-favorites/:bookId`
-  **Descripción**: Añade un libro a favoritos.
-  **Método**: POST
-  **DB**:  Actualiza booleano `favorites` en un libro.
- 
#### DELETE `/api/books/remove-favorite/:bookId`

-  **Descripción**: Elimina un libro de favoritos.
-  **Método**: DELETE
-  **DB**: Actualiza booleano `favorites` en un libro.
- 
### DELETE `/api/books/remove-from-list/:bookId`
-  **Descripción**: Elimina un libro de la lista del usuario.
-  **Método**: DELETE
-  **DB**: Elimina elemento de la tablas `user_books`.

### DELETE `/api/books/delete-review/:bookId`
-  **Descripción**: Elimina una reseña de un libro del usuario.
-  **Método**: DELETE
-  **DB**: Elimina la informacion del campo`review`.
- 
## Administración (`/api/admin`):

*Todas las rutas requieren autenticación y permisos de administrador*

### Gestión de Usuarios:
#### GET `/api/admin/users`

-  **Descripción**: Obtiene lista de todos los usuarios
-  **Método**: GET
-  **DB**: Consulta la tabla `users` de la base de datos.

#### GET `/api/admin/users/:userId/books`

-  **Descripción**: Obtiene los libros de un usuario específico
-  **Método**: GET
-  **DB**: Consulta usuario específico en `users` y hace obtiene todos sus libros de `books`

#### PUT `/api/admin/users/:userId`
-  **Descripción**: Actualiza información de usuario
-  **Método**: PUT
-  **DB**: Actualiza elemento en tabla `users`.

#### DELETE `/api/admin/users/:userId`

-  **Descripción**: Elimina un usuario
-  **Método**: DELETE
-  **DB**: Elimina elemento de tabla `users`.

#### PUT `/api/admin/users/:userId/toggle-admin`
-  **Descripción**: Activa/desactiva permisos de administrador
-  **Método**: PUT
-  **DB**: Actualiza campo `isAdmin` en un usuario de la tabla `users`.,

### Administrar libros:
#### GET `/api/admin/books`

-  **Descripción**: Obtiene lista de todos los libros en la base de datos
-  **Método**: GET
-  **DB**: Consulta tabla `books`.

#### PUT `/api/admin/books/:bookId`
-  **Descripción**: Actualiza información de un libro
-  **Método**: PUT
-  **DB**: Actualiza elemento en tabla `books`.

#### DELETE `/api/admin/books/:bookId`
-  **Descripción**: Elimina un libro
-  **Método**: DELETE
-  **DB**: Elimina elemento de tabla `books`.
