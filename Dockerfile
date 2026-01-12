# Usa Node 20 (requerido por Next 15+)
FROM node:20-alpine

# Establecer la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .
COPY next.config.mjs ./next.config.mjs
# Exponer el puerto por donde corre Next
EXPOSE 3000

# Modo desarrollo (hot reload)
CMD ["npm", "run", "dev"]
