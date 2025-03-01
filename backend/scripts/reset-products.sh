#!/bin/bash

# Script pour nettoyer la base de données et réinitialiser les produits

# Chemin vers le répertoire racine du projet (où se trouve docker-compose.yml)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Afficher les informations
echo -e "\033[0;36mNettoyage et réinitialisation des produits dans la base de données...\033[0m"

# Se déplacer vers le répertoire racine
cd "$ROOT_DIR"

# Vérifier si le conteneur est en cours d'exécution
CONTAINER_RUNNING=$(docker-compose ps | grep -E "postgres.*Up")

if [ -z "$CONTAINER_RUNNING" ]; then
    echo -e "\033[0;33mLe conteneur PostgreSQL n'est pas en cours d'exécution. Démarrage...\033[0m"
    docker-compose up -d postgres
    # Attendre que le conteneur soit prêt
    sleep 5
fi

# Exécuter la requête SQL pour supprimer tous les produits
echo -e "\033[0;33mSuppression de tous les produits existants...\033[0m"
docker-compose exec -T postgres psql -U breizhsport -d breizhsport -c "DELETE FROM products;"

# Vérifier si la suppression a réussi
if [ $? -eq 0 ]; then
    echo -e "\033[0;32mTous les produits ont été supprimés avec succès!\033[0m"
    
    # Revenir au répertoire backend pour exécuter le script de seed
    cd "$ROOT_DIR/backend"
    
    # Exécuter le script de seed pour réinitialiser les produits
    echo -e "\033[0;33mRéinitialisation des produits...\033[0m"
    npm run seed:products
    
    if [ $? -eq 0 ]; then
        echo -e "\033[0;32mLes produits ont été réinitialisés avec succès!\033[0m"
    else
        echo -e "\033[0;31mErreur lors de la réinitialisation des produits.\033[0m"
    fi
else
    echo -e "\033[0;31mErreur lors de la suppression des produits.\033[0m"
fi

# Revenir au répertoire initial
cd "$SCRIPT_DIR" 