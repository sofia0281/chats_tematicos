# Ubicación: frontend/Dockerfile
FROM node:20

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto interno de Next.js
EXPOSE 3000

# Iniciamos en modo desarrollo
CMD ["npm", "run", "dev"]