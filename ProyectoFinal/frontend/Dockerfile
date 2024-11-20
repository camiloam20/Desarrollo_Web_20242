# Usamos una imagen de nginx para servir archivos estáticos
FROM nginx:alpine

# Copiamos los archivos del frontend a la carpeta predeterminada de nginx
COPY . /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80
