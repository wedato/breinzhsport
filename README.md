# Breizhsport - POC E-commerce

## Description

Breizhsport est une plateforme e-commerce de vente d'équipements sportifs, similaire à Décathlon. Ce POC (Proof of Concept) implémente les fonctionnalités de base d'une boutique en ligne.

## Architecture Technique

### Vue d'ensemble

L'application suit une architecture microservices composée de :

- Frontend : Next.js (React)
- Backend : Nest.js
- Base de données : PostgreSQL
- Communication : API REST

### Structure des Services

#### Backend (Nest.js)

1. **Service Produits**

   - Gestion du catalogue
   - Recherche et filtrage
   - Gestion des catégories

2. **Service Utilisateurs**

   - Authentification (JWT)
   - Gestion des profils
   - Autorisations

3. **Service Panier**

   - Gestion du panier
   - Calcul des totaux
   - Sessions temporaires

4. **Service Paiement**
   - Simulation de paiement
   - Gestion des commandes
   - Historique des transactions

#### Frontend (Next.js)

1. **Pages Principales**

   - Catalogue produits
   - Détail produit
   - Panier
   - Compte utilisateur

2. **Composants Réutilisables**
   - Header/Footer
   - Cards produits
   - Formulaires
   - Composants UI

### Base de données

- PostgreSQL pour la persistance des données
- Schémas séparés par service
- Migrations gérées par TypeORM

## Installation

### Prérequis

- Node.js (v18+)
- Docker et Docker Compose
- Git

### Configuration de l'environnement

1. Cloner le repository :

```bash
git clone [URL_DU_REPO]
cd breizhsport
```

2. Installer les dépendances :

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Lancer l'environnement Docker :

```bash
docker-compose up -d
```

## Structure du Projet

```
breizhsport/
├── backend/                 # API Nest.js
│   ├── src/
│   │   ├── products/       # Module produits
│   │   ├── users/          # Module utilisateurs
│   │   ├── cart/           # Module panier
│   │   └── orders/         # Module commandes
│   └── test/               # Tests
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/         # Pages Next.js
│   │   └── styles/        # Styles CSS/SCSS
│   └── public/            # Assets statiques
└── docker/                # Configuration Docker
    ├── postgres/
    └── nginx/
```

## Conventions de Code

### Git Flow

- `main` : Production
- `develop` : Développement
- `feature/*` : Nouvelles fonctionnalités
- `hotfix/*` : Corrections urgentes

### Commits

Format : `type(scope): description`
Types :

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Maintenance

## Tests

- Tests unitaires : Jest
- Tests E2E : Cypress (Frontend) / Supertest (Backend)
- Coverage minimum : 80%

## Documentation API

- Swagger UI : `http://localhost:3000/api`
- Documentation détaillée des endpoints dans `/backend/docs`
