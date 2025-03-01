# Script pour nettoyer la base de données et réinitialiser les produits

# Chemin vers le répertoire racine du projet (où se trouve docker-compose.yml)
$rootDir = Join-Path -Path $PSScriptRoot -ChildPath "../.."
$scriptDir = $PSScriptRoot

# Afficher les informations
Write-Host "Nettoyage et réinitialisation des produits dans la base de données..." -ForegroundColor Cyan

# Se déplacer vers le répertoire racine
Push-Location -Path $rootDir

try {
    # Vérifier si le conteneur est en cours d'exécution
    $containerRunning = docker-compose ps | Select-String -Pattern "postgres.*Up"
    
    if (-not $containerRunning) {
        Write-Host "Le conteneur PostgreSQL n'est pas en cours d'exécution. Démarrage..." -ForegroundColor Yellow
        docker-compose up -d postgres
        # Attendre que le conteneur soit prêt
        Start-Sleep -Seconds 5
    }
    
    # Exécuter la requête SQL pour supprimer tous les produits
    Write-Host "Suppression de tous les produits existants..." -ForegroundColor Yellow
    $containerName = docker-compose ps -q postgres
    docker-compose exec -T postgres psql -U breizhsport -d breizhsport -c "DELETE FROM products;"
    
    # Vérifier si la suppression a réussi
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Tous les produits ont été supprimés avec succès!" -ForegroundColor Green
        
        # Revenir au répertoire backend pour exécuter le script de seed
        Pop-Location
        Push-Location -Path (Join-Path -Path $rootDir -ChildPath "backend")
        
        # Exécuter le script de seed pour réinitialiser les produits
        Write-Host "Réinitialisation des produits..." -ForegroundColor Yellow
        npm run seed:products
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Les produits ont été réinitialisés avec succès!" -ForegroundColor Green
        } else {
            Write-Host "Erreur lors de la réinitialisation des produits." -ForegroundColor Red
        }
    } else {
        Write-Host "Erreur lors de la suppression des produits." -ForegroundColor Red
    }
} finally {
    # Revenir au répertoire précédent
    Pop-Location
} 