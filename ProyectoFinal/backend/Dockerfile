# Usa la imagen oficial de Node.js
FROM node:18

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
