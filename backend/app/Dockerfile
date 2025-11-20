# Ubicación: backend/app/Dockerfile

# Usamos una imagen ligera de Node
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los package.json para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto por defecto de NestJS
EXPOSE 3000

# Comando para iniciar en modo desarrollo (con hot-reload)
CMD ["npm", "run", "start:dev"]