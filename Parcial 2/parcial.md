# ¿Qué hay hacer?
Construir una aplicación que consuma la API asignada y modifique el DOM, usando javascript
* usar async/await
* usa módulos
* usar clases
* separar la lógica de los llamados a la API y el manejo del DOM
* usar los métodos HTTP correctos para cada llamado
* el archivo parcial-api.yaml describe la api a consumir en formato OpenAPI. Puede lanzar la aplicación en un conenedor, tal como vimos en la clase anterior.
## Consultar listado de elementos
Con los resultados debe crear dinámicamente los elementos correspondientes para visualizar cada uno de los resultados retornados.
* Use CSS de tal modo que se pueda diferenciar un elemento de los otros
* Utilice javascript para asociar esos estilos css con los elementos en el DOM
## Crear nuevo elemento
Crear un formulario que permita crear un nuevo elemento. Al momento que el usuario quiera enviar los resultados, verifique que sean válidos antes de llamar a la API y, una vez se llame a la API, muestre un mensaje para indicar si la operación fué exitosa o no. 
* Recuerde el manejo de excepciones
* El mensaje se puede mostrar en el HTML, con un alert o simplemente en consola, queda a su criterio
* Asuma que el id del elemento se le asigna en el backend
## Modificar elemento
Lo mismo que el item anterior, pero esta vez se va a modificar un elemento ya existente, que debe ser uno de los retornados al momento de consultar los elementos.
* El elemento a modificar debe ser eleigo del listado recibido anteriormente.
* Cuando se haga click en el elemento del listado, se debe llenar el formulario con los datos existentes.


