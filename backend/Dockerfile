FROM node:20-alpine

WORKDIR /app

# Installer les dépendances nécessaires pour Prisma
RUN apk add --no-cache openssl

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers Prisma
COPY prisma ./prisma/

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 3001

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "start:dev"] 