FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le projet
COPY . .

# Exposer les ports nécessaires
EXPOSE 19000 19001 19002

# Démarrer Expo avec tunnel
CMD ["npx", "expo", "start", "--tunnel"]
