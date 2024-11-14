FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema necesarias para bcrypt
RUN apk add --no-cache make gcc g++ python3

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]