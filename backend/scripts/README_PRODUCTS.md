# Gestion des produits dans la base de données

Ce document explique comment gérer les produits dans la base de données de l'application Breizhsport.

## Initialisation automatique des produits

Les produits sont automatiquement initialisés au démarrage du serveur. Le script vérifie si des produits existent déjà dans la base de données :

- Si aucun produit n'existe, il initialise la base de données avec une liste de produits prédéfinis.
- Si des produits existent déjà, il ne fait rien.

## Scripts disponibles

### Initialisation manuelle des produits

Pour initialiser manuellement les produits, vous pouvez utiliser la commande suivante :

```bash
# Dans le dossier backend
npm run seed:products
```

### Réinitialisation complète des produits

Si vous souhaitez supprimer tous les produits existants et réinitialiser la base de données avec les produits par défaut, vous pouvez utiliser les scripts suivants :

#### Sous Windows (PowerShell)

```powershell
cd backend/scripts
.\reset-products.ps1
```

#### Sous Linux/Mac

```bash
cd backend/scripts
chmod +x reset-products.sh
./reset-products.sh
```

## Modification des produits par défaut

Si vous souhaitez modifier la liste des produits par défaut, vous pouvez éditer le fichier `backend/src/seed/seed-products.ts`.

La liste des produits est définie au début du fichier sous forme d'un tableau d'objets. Chaque objet représente un produit avec les propriétés suivantes :

```typescript
{
  name: string;         // Nom du produit
  description: string;  // Description du produit
  price: number;        // Prix du produit
  category: string;     // Catégorie du produit
  brand: string;        // Marque du produit
  stock: number;        // Quantité en stock
  images: string[];     // Liste des URLs des images du produit
}
```

Après avoir modifié ce fichier, vous devrez réinitialiser la base de données pour que les changements prennent effet.

## Nettoyage de la base de données

Pour nettoyer complètement la base de données (supprimer toutes les tables), vous pouvez utiliser les scripts de nettoyage décrits dans le fichier `README.md` du dossier `scripts`.
