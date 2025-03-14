# Images utilisées dans le site

## Images de produits (dans `/public/images/products/`)

Format: AVIF

### Images de produits spécifiques

- `premium_photo-1668767725891-58f5cd788105.avif` - Ballon de football professionnel Nike
- `premium_photo-1726403375929-632543b64ba0.avif` - Chaussures de football Adidas Predator
- `photo-1552066379-e7bfd22155c5.avif` - Ballon de basketball NBA Spalding
- `premium_photo-1663133632945-4a9e77571659.avif` - Raquette de tennis Wilson Pro
- `premium_photo-1675155952889-abb299df1fe7.avif` - Maillot de l'équipe de France de football
- `premium_photo-1707674570919-30236af857e8.avif` - Image pour la catégorie Running
- `photo-1511886929837-354d827aae26.avif` - Image pour la catégorie Fitness
- `g-form-pro-s-vento.avif` - Image pour la catégorie Boxe
- `premium_photo-1668767725936-f896fbca8c66.avif` - Image par défaut générale
- `premium_photo-1675803775295-40710e76825b.avif` - Image supplémentaire (non utilisée actuellement)
- `premium_photo-1675155952889-abb299df1fe7.avif` - Image supplémentaire (non utilisée actuellement)

## Utilisation des images dans le code

Les images sont référencées dans les fichiers suivants:

- `frontend/src/app/page.tsx` - Page d'accueil
- `frontend/src/app/product/[id]/page.tsx` - Page produit
- `frontend/src/components/ProductImage.tsx` - Composant d'image de produit

## Ajout de nouvelles images

Pour ajouter de nouvelles images:

1. Placez les fichiers AVIF dans le dossier `/public/images/products/`
2. Mettez à jour les références dans le code selon les besoins

## Dimensions recommandées

- Images de produits: 800x800px (ratio 1:1)
- Images de catégories: 600x400px (ratio 3:2)
