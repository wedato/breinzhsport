# Scripts de maintenance de la base de données

Ce dossier contient des scripts pour maintenir et nettoyer la base de données.

## Nettoyage des tables redondantes

Le script `clean_database.sql` permet de supprimer les tables redondantes dans la base de données :

- `cart_item` (nous gardons `cart_items`)
- `product` (nous gardons `products`)
- `user` (nous gardons `users`)

### Exécution sous Windows (PowerShell) avec Docker

Pour exécuter le script de nettoyage sous Windows avec Docker (recommandé), utilisez PowerShell :

```powershell
cd backend/scripts
.\clean_database_docker.ps1
```

Ce script utilise docker-compose pour exécuter les commandes SQL directement dans le conteneur PostgreSQL.

### Exécution sous Windows (PowerShell) avec psql local

Si vous avez PostgreSQL installé localement, vous pouvez utiliser :

```powershell
cd backend/scripts
.\clean_database.ps1
```

### Exécution sous Linux/Mac

Pour exécuter le script de nettoyage sous Linux ou Mac, utilisez le terminal :

```bash
cd backend/scripts
chmod +x clean_database.sh
./clean_database.sh
```

## Pourquoi ces tables sont-elles redondantes ?

Dans notre application, nous utilisons TypeORM qui, par défaut, transforme les noms des entités en snake_case et au pluriel pour les noms de tables dans la base de données. Par exemple :

- L'entité `CartItem` devient la table `cart_items`
- L'entité `Product` devient la table `products`
- L'entité `User` devient la table `users`

Les tables au singulier (`cart_item`, `product`, `user`) sont probablement des restes d'anciennes migrations ou de configurations précédentes.

## Standardisation des noms de tables

Pour éviter toute confusion à l'avenir, nous avons standardisé les noms de tables en utilisant l'annotation `@Entity('nom_de_table')` dans nos entités TypeORM pour spécifier explicitement le nom de la table.
