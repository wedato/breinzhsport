# Script pour nettoyer la base de données en utilisant docker-compose

# Chemin vers le répertoire racine du projet (où se trouve docker-compose.yml)
$rootDir = Join-Path -Path $PSScriptRoot -ChildPath "../.."
$scriptDir = $PSScriptRoot

# Afficher les informations
Write-Host "Nettoyage de la base de données via docker-compose..."

# Chemin vers le script SQL
$sqlScript = Join-Path -Path $scriptDir -ChildPath "clean_database.sql"
$sqlScriptContent = Get-Content -Path $sqlScript -Raw

# Créer un fichier temporaire pour le script SQL
$tempSqlFile = Join-Path -Path $env:TEMP -ChildPath "temp_clean_database.sql"
$sqlScriptContent | Out-File -FilePath $tempSqlFile -Encoding utf8

# Se déplacer vers le répertoire racine
Push-Location -Path $rootDir

try {
    # Copier le fichier SQL dans le conteneur PostgreSQL
    Write-Host "Copie du script SQL dans le conteneur..."
    
    # Vérifier si le conteneur est en cours d'exécution
    $containerRunning = docker-compose ps | Select-String -Pattern "postgres.*Up"
    
    if (-not $containerRunning) {
        Write-Host "Le conteneur PostgreSQL n'est pas en cours d'exécution. Démarrage..."
        docker-compose up -d postgres
        # Attendre que le conteneur soit prêt
        Start-Sleep -Seconds 5
    }
    
    # Exécuter le script SQL
    Write-Host "Exécution du script de nettoyage..."
    # Utiliser docker cp au lieu de redirection
    $containerName = docker-compose ps -q postgres
    docker cp $tempSqlFile ${containerName}:/tmp/clean_database.sql
    docker-compose exec -T postgres psql -U breizhsport -d breizhsport -f /tmp/clean_database.sql
    
    # Afficher un message de succès
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Nettoyage terminé avec succès!" -ForegroundColor Green
    } else {
        Write-Host "Erreur lors du nettoyage de la base de données." -ForegroundColor Red
    }
} finally {
    # Revenir au répertoire précédent
    Pop-Location
    
    # Supprimer le fichier temporaire
    if (Test-Path $tempSqlFile) {
        Remove-Item -Path $tempSqlFile
    }
} 