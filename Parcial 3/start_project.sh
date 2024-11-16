#!/bin/bash

# Detener y remover todos los contenedores y volúmenes
docker-compose down -v

# Remover todas las imágenes no utilizadas y contenedores detenidos
docker system prune -a -f

# Levantar los servicios en segundo plano
docker-compose up -d

# Abrir las URLs en el navegador
cmd.exe /c start http://localhost:8080/ #URL de la aplicación frontend
cmd.exe /c start "http://localhost:5050/" #URL de la base de datos con Adminer
#Usar estas credenciales:
#PGADMIN_EMAIL:admin@admin.com
#PGADMIN_PASSWORD:admin