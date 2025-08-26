# Imagen base oficial de Node.js
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto que usa tu app (ajusta si usas otro)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "dev"]

