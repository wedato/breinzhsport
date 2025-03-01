# Récupérer les variables d'environnement depuis le fichier .env
$envFile = Join-Path -Path $PSScriptRoot -ChildPath "../.env"
$envContent = Get-Content -Path $envFile

# Créer un hashtable pour stocker les variables d'environnement
$env = @{}

# Analyser le fichier .env
foreach ($line in $envContent) {
    if ($line -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $env[$key] = $value
    }
}

# Afficher les informations de connexion
Write-Host "Connexion à la base de données PostgreSQL via Docker..."
Write-Host "Host: $($env.DATABASE_HOST)"
Write-Host "Port: $($env.DATABASE_PORT)"
Write-Host "Database: $($env.DATABASE_NAME)"
Write-Host "User: $($env.DATABASE_USER)"

# Chemin vers le script SQL
$sqlScript = Join-Path -Path $PSScriptRoot -ChildPath "clean_database.sql"
$sqlScriptContent = Get-Content -Path $sqlScript -Raw

# Créer un fichier temporaire pour le script SQL
$tempSqlFile = Join-Path -Path $env:TEMP -ChildPath "temp_clean_database.sql"
$sqlScriptContent | Out-File -FilePath $tempSqlFile -Encoding utf8

# Exécuter le script SQL avec Docker
Write-Host "Exécution du script de nettoyage via Docker..."
docker exec -i postgres psql -U $env.DATABASE_USER -d $env.DATABASE_NAME -f /tmp/temp_clean_database.sql

# Si la commande ci-dessus échoue, essayez cette alternative
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tentative alternative avec le conteneur PostgreSQL..."
    # Trouver le nom du conteneur PostgreSQL
    $pgContainer = docker ps | Select-String -Pattern "postgres" | ForEach-Object { $_.ToString().Split()[0] }
    
    if ($pgContainer) {
        Write-Host "Conteneur PostgreSQL trouvé: $pgContainer"
        # Copier le fichier SQL dans le conteneur
        docker cp $tempSqlFile ${pgContainer}:/tmp/temp_clean_database.sql
        # Exécuter le script SQL
        docker exec -i $pgContainer psql -U $env.DATABASE_USER -d $env.DATABASE_NAME -f /tmp/temp_clean_database.sql
    } else {
        Write-Host "Aucun conteneur PostgreSQL trouvé. Essayons avec docker-compose..."
        # Utiliser docker-compose pour exécuter la commande
        docker-compose exec -T postgres psql -U $env.DATABASE_USER -d $env.DATABASE_NAME -f /tmp/temp_clean_database.sql
    }
}

# Supprimer le fichier temporaire
if (Test-Path $tempSqlFile) {
    Remove-Item -Path $tempSqlFile
}

Write-Host "Nettoyage terminé." 