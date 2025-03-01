#!/bin/bash

# Récupérer les variables d'environnement depuis le fichier .env
source ../.env

# Afficher les informations de connexion
echo "Connexion à la base de données PostgreSQL..."
echo "Host: $DATABASE_HOST"
echo "Port: $DATABASE_PORT"
echo "Database: $DATABASE_NAME"
echo "User: $DATABASE_USER"

# Exécuter le script SQL
echo "Exécution du script de nettoyage..."
PGPASSWORD=$DATABASE_PASSWORD psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USER -d $DATABASE_NAME -f clean_database.sql

echo "Nettoyage terminé." 