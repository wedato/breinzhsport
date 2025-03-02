# BreizhSport - Plateforme d'e-commerce pour équipements sportifs

BreizhSport est une plateforme d'e-commerce moderne pour la vente d'équipements sportifs, développée avec Next.js pour le frontend et Nest.js pour le backend.

## Table des matières

1. [Système de veille technologique](#système-de-veille-technologique)
2. [Architecture et choix technologiques](#architecture-et-choix-technologiques)
3. [Méthodologie de développement](#méthodologie-de-développement)
4. [Intégration et déploiement continus (CI/CD)](#intégration-et-déploiement-continus-cicd)
5. [Passage de la POC à la production](#passage-de-la-poc-à-la-production)
6. [Dynamique collective d'apprentissage](#dynamique-collective-dapprentissage)
7. [Politique de qualité logicielle](#politique-de-qualité-logicielle)
8. [Politique de tests](#politique-de-tests)
9. [Sécurité des applications](#sécurité-des-applications)
10. [Démarche d'amélioration continue](#démarche-damélioration-continue)
11. [Installation et démarrage](#installation-et-démarrage)
12. [Documentation API](#documentation-api)
13. [Structure du projet](#structure-du-projet)
14. [Monitoring et métriques](#monitoring-et-métriques)
15. [Contribuer](#contribuer)

## Système de veille technologique

Pour maintenir notre expertise technique et rester à jour avec les évolutions rapides des technologies, nous avons mis en place un système de veille technologique structuré :

### Organisation de la veille

1. **Réunions hebdomadaires de veille (1h)** : Chaque membre de l'équipe présente une découverte technique pertinente
2. **Veille quotidienne (15-30 min)** : Temps dédié chaque jour pour consulter les sources d'information
3. **Revue trimestrielle des technologies** : Évaluation des technologies utilisées et exploration des alternatives

### Sources de veille

| Catégorie              | Sources                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Newsletters**        | JavaScript Weekly, Node Weekly, React Status, Changelog                    |
| **Blogs techniques**   | Medium, Dev.to, CSS-Tricks, Smashing Magazine, NestJS Blog                 |
| **Réseaux sociaux**    | Twitter (comptes tech), LinkedIn, Reddit (r/javascript, r/reactjs, r/node) |
| **Podcasts**           | Syntax.fm, JS Party, React Podcast, Modern Web                             |
| **Conférences**        | React Summit, NestJS Conf, Next.js Conf, NodeConf                          |
| **GitHub**             | Trending repositories, Release notes des frameworks utilisés               |
| **Outils de curation** | Feedly, Pocket, Refind                                                     |

### Outils de partage

- **Notion** : Base de connaissances partagée pour centraliser les découvertes
- **Slack** : Canal dédié #veille-tech pour partager des articles intéressants
- **GitHub Discussions** : Pour les discussions techniques approfondies

## Architecture et choix technologiques

### Architecture Cloud Native

Notre architecture suit les principes Cloud Native, avec une approche microservices pour assurer la scalabilité et la résilience :

![Architecture BreizhSport](https://via.placeholder.com/800x400?text=Architecture+BreizhSport)

### Grille de choix technologiques

#### Frontend

| Technologie              | Alternatives           | Justification du choix                                                            |
| ------------------------ | ---------------------- | --------------------------------------------------------------------------------- |
| **Next.js**              | React, Vue.js, Angular | Framework React avec SSR/SSG, optimisé pour le SEO, routing intégré, excellent DX |
| **TypeScript**           | JavaScript             | Typage statique, meilleure maintenabilité, autocomplétion IDE                     |
| **Tailwind CSS**         | Bootstrap, Material UI | Utilitaire CSS hautement personnalisable, bundle size optimisée                   |
| **React Query**          | Redux, MobX            | Gestion simplifiée des états asynchrones et du cache                              |
| **Jest/Testing Library** | Cypress, Playwright    | Écosystème de test complet, facile à intégrer                                     |

#### Backend

| Technologie    | Alternatives          | Justification du choix                                                     |
| -------------- | --------------------- | -------------------------------------------------------------------------- |
| **Nest.js**    | Express, Fastify, Koa | Architecture modulaire, support TypeScript natif, injection de dépendances |
| **TypeScript** | JavaScript            | Typage statique, meilleure maintenabilité, décorateurs                     |
| **PostgreSQL** | MySQL, MongoDB        | SGBD relationnel robuste, support JSON, transactions ACID                  |
| **Prisma**     | TypeORM, Sequelize    | ORM moderne avec génération de types, migrations simplifiées               |
| **Jest**       | Mocha, Jasmine        | Framework de test complet, mocking facile                                  |

#### Infrastructure

| Technologie            | Alternatives               | Justification du choix                                         |
| ---------------------- | -------------------------- | -------------------------------------------------------------- |
| **Docker**             | VM, déploiement bare metal | Conteneurisation légère, environnements cohérents              |
| **Kubernetes**         | Docker Swarm, Nomad        | Orchestration de conteneurs, auto-scaling, haute disponibilité |
| **GitHub Actions**     | Jenkins, GitLab CI         | Intégration native avec GitHub, configuration YAML simple      |
| **Prometheus/Grafana** | ELK Stack, Datadog         | Monitoring open-source, métriques personnalisables             |
| **AWS**                | GCP, Azure                 | Leader du marché, large gamme de services, documentation riche |

### Choix d'hébergement

| Critère               | AWS        | GCP        | Azure      | Auto-hébergé |
| --------------------- | ---------- | ---------- | ---------- | ------------ |
| **Coût**              | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐⭐⭐   |
| **Scalabilité**       | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐⭐         |
| **Services managés**  | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   | ⭐           |
| **Sécurité**          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐       |
| **Support**           | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐         |
| **Expertise requise** | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐⭐⭐   |

**Choix final** : AWS pour sa maturité, sa large gamme de services et sa documentation complète.

## Méthodologie de développement

Nous avons adopté une méthodologie Agile Scrum adaptée aux besoins de Breizhsport :

### Processus de développement

1. **Sprints de 2 semaines** avec les cérémonies Scrum standard
2. **Développement piloté par les tests (TDD)** pour garantir la qualité du code
3. **Revues de code** obligatoires via Pull Requests
4. **Intégration continue** avec tests automatisés
5. **Déploiement continu** sur les environnements de développement et staging

### Pratiques d'ingénierie

- **Trunk-based development** avec feature flags pour les fonctionnalités en cours
- **Pair programming** pour les tâches complexes
- **Mob programming** pour les décisions d'architecture importantes
- **Refactoring régulier** pour maintenir la qualité du code
- **Documentation as code** avec OpenAPI et Markdown

## Intégration et déploiement continus (CI/CD)

Notre pipeline CI/CD est conçu pour automatiser le processus de test, de build et de déploiement :

![Pipeline CI/CD](https://via.placeholder.com/800x200?text=Pipeline+CI/CD)

### Pipeline GitHub Actions

```yaml
# Résumé du pipeline
- Lint et tests unitaires
- Tests d'intégration
- Build des images Docker
- Tests de sécurité (SAST)
- Déploiement sur environnement de staging
- Tests end-to-end
- Déploiement en production (manuel)
```

### Environnements

1. **Développement** : Déploiement automatique à chaque commit sur une branche de feature
2. **Staging** : Déploiement automatique à chaque merge sur la branche principale
3. **Production** : Déploiement manuel après validation sur l'environnement de staging

### Monitoring du pipeline

- Notifications Slack pour les échecs de build
- Tableaux de bord pour suivre les métriques du pipeline (temps de build, taux de succès)
- Rapports de couverture de tests et d'analyse de code

## Passage de la POC à la production

### Points critiques et solutions

| Point critique  | Risque                            | Solution proposée                                                              |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| **Scalabilité** | Surcharge lors des pics de trafic | Architecture microservices, auto-scaling Kubernetes, CDN pour assets statiques |
| **Résilience**  | Indisponibilité du service        | Circuit breakers, retry patterns, déploiement multi-AZ                         |
| **Performance** | Temps de réponse lents            | Caching (Redis), optimisation des requêtes DB, lazy loading                    |
| **Sécurité**    | Vulnérabilités, fuites de données | Tests de sécurité automatisés, chiffrement des données sensibles, WAF          |
| **Monitoring**  | Détection tardive des problèmes   | Alerting proactif, dashboards Grafana, logs centralisés                        |
| **Coûts**       | Dépassement de budget             | Rightsizing des ressources, auto-scaling, analyse régulière des coûts          |

### Plan de migration

1. **Phase 1** : Déploiement en production limitée (beta)
2. **Phase 2** : Montée en charge progressive avec monitoring renforcé
3. **Phase 3** : Déploiement complet avec bascule de trafic progressive

## Dynamique collective d'apprentissage

Pour garantir la montée en compétences de l'équipe et l'intégration des nouveaux membres, nous avons mis en place :

### Pratiques de partage de connaissances

1. **Onboarding structuré** (2 semaines)

   - Documentation complète du projet
   - Sessions de pair programming avec différents membres de l'équipe
   - Tâches progressives de complexité croissante

2. **Sessions régulières**

   - **Tech Talks** bi-mensuels (45 min) sur des sujets techniques
   - **Coding Dojos** mensuels pour pratiquer ensemble
   - **Revues d'architecture** trimestrielles

3. **Pratiques quotidiennes**

   - **Pair/Mob programming** pour les tâches complexes
   - **Revues de code** constructives et bienveillantes
   - **Documentation continue** du code et des décisions d'architecture

4. **Ressources d'apprentissage**
   - Abonnements à des plateformes de formation (Pluralsight, Udemy)
   - Bibliothèque technique partagée (physique et numérique)
   - Budget formation individuel

## Politique de qualité logicielle

Notre politique de qualité logicielle s'articule autour de trois axes :

### Culture

- **Qualité comme responsabilité partagée** de tous les membres de l'équipe
- **Priorisation de la qualité** sur la vitesse de livraison
- **Refactoring continu** pour maintenir la dette technique à un niveau acceptable
- **Revues de code** systématiques et constructives

### Pratiques

- **Clean Code** : principes SOLID, DRY, KISS
- **Tests automatisés** : unitaires, intégration, end-to-end
- **Intégration continue** : tests à chaque commit
- **Analyse statique du code** : linting, formatting automatique
- **Revues de code** : au moins un approbateur par PR

### Outils

| Catégorie           | Outils                       |
| ------------------- | ---------------------------- |
| **Gestion de code** | GitHub, Conventional Commits |
| **Qualité de code** | ESLint, Prettier, SonarQube  |
| **Tests**           | Jest, Supertest, Cypress     |
| **CI/CD**           | GitHub Actions               |
| **Monitoring**      | Prometheus, Grafana          |
| **Documentation**   | OpenAPI, Storybook, Markdown |

### Gestion de la dette technique

1. **Identification** : via SonarQube et revues de code
2. **Priorisation** : basée sur l'impact et l'effort
3. **Allocation de temps** : 20% du temps de sprint dédié à la réduction de dette
4. **Suivi** : métriques de qualité de code dans les dashboards

## Politique de tests

Notre stratégie de tests pyramidale assure une couverture complète tout en optimisant le temps d'exécution :

![Pyramide de tests](https://via.placeholder.com/400x300?text=Pyramide+de+tests)

### Types de tests

| Type de test             | Couverture cible   | Outils               | Fréquence       |
| ------------------------ | ------------------ | -------------------- | --------------- |
| **Tests unitaires**      | 80%                | Jest                 | À chaque commit |
| **Tests d'intégration**  | 70%                | Jest, Supertest      | À chaque commit |
| **Tests API**            | 90% des endpoints  | Supertest, Postman   | À chaque commit |
| **Tests E2E**            | Parcours critiques | Cypress              | À chaque PR     |
| **Tests de performance** | APIs critiques     | k6, Artillery        | Hebdomadaire    |
| **Tests de sécurité**    | Ensemble du code   | OWASP ZAP, SonarQube | À chaque PR     |

### Automatisation

- **Pre-commit hooks** : linting et tests unitaires
- **CI/CD** : tous les types de tests selon leur fréquence
- **Rapports de couverture** générés automatiquement
- **Dashboards** de suivi de la qualité des tests

### Non-régression

- **Tests de non-régression** automatisés pour les fonctionnalités critiques
- **Tests de régression visuelle** pour l'interface utilisateur
- **Snapshots** pour les composants UI

## Sécurité des applications

### Risques principaux et mitigations

| Risque                              | Mitigation                                  |
| ----------------------------------- | ------------------------------------------- |
| **Injection SQL**                   | ORM (Prisma), requêtes paramétrées          |
| **XSS**                             | Échappement automatique avec React, CSP     |
| **CSRF**                            | Tokens CSRF, SameSite cookies               |
| **Authentification faible**         | JWT avec rotation, 2FA pour admin           |
| **Exposition de données sensibles** | Chiffrement, masquage des données sensibles |
| **RBAC insuffisant**                | Système de permissions granulaire           |
| **Dépendances vulnérables**         | Analyse automatique (Dependabot)            |

### Procédure de sécurisation

1. **Conception** : Threat modeling, principes de privacy by design
2. **Développement** : Guidelines de sécurité, formation continue
3. **Tests** : SAST, DAST, pentests réguliers
4. **Déploiement** : Scanning des images Docker, vérification des secrets
5. **Production** : WAF, monitoring de sécurité, gestion des incidents

### Plan d'audit systématique

- **Audits automatisés** : hebdomadaires via outils SAST/DAST
- **Audits manuels** : trimestriels par l'équipe sécurité
- **Pentests** : semestriels par une entreprise externe
- **Revue de configuration** : mensuelle
- **Bug bounty** : programme continu

## Démarche d'amélioration continue

Notre démarche d'amélioration continue s'appuie sur le cycle PDCA (Plan-Do-Check-Act) :

### Processus d'amélioration

1. **Mesure** : KPIs techniques et métier, feedback utilisateurs
2. **Analyse** : Rétrospectives, analyse des incidents, revues de performance
3. **Amélioration** : Actions priorisées, expérimentations
4. **Validation** : Mesure de l'impact des améliorations

### Maintenance applicative

| Type           | Fréquence     | Procédure                                         |
| -------------- | ------------- | ------------------------------------------------- |
| **Corrective** | En continu    | Système de tickets, SLA selon criticité           |
| **Préventive** | Mensuelle     | Analyse proactive, mise à jour des dépendances    |
| **Évolutive**  | Trimestrielle | Roadmap produit, priorisation basée sur la valeur |
| **Perfective** | Semestrielle  | Optimisation des performances, refactoring        |

### Gestion des incidents

1. **Détection** : Monitoring proactif, alerting
2. **Classification** : Par impact et urgence
3. **Résolution** : Procédures documentées, war room pour incidents critiques
4. **Post-mortem** : Analyse des causes racines, actions préventives

## Installation et démarrage

### Cloner le dépôt

```bash
git clone https://github.com/wedato/breinzhsport.git
cd breinzhsport
```

### Démarrage avec Docker Compose (recommandé)

Cette méthode lance l'ensemble de l'application (frontend, backend et base de données) en une seule commande :

```bash
docker-compose up -d
```

L'application sera accessible aux adresses suivantes :

- Frontend : http://localhost:8080
- Backend API : http://localhost:3001
- Documentation API : http://localhost:3001/api
- Prometheus : http://localhost:9090
- Grafana : http://localhost:3005

### Installation manuelle (pour le développement)

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentation API

Le backend est documenté à l'aide de Swagger UI, ce qui permet d'explorer et de tester facilement l'API.

### Accès à la documentation

Une fois le serveur backend démarré, la documentation Swagger est accessible à l'adresse :

```
http://localhost:3001/api
```

### Fonctionnalités de la documentation

- **Exploration interactive** : Testez les endpoints directement depuis l'interface
- **Authentification** : Utilisez le bouton "Authorize" pour vous authentifier avec un token JWT
- **Modèles de données** : Visualisez les schémas de données utilisés par l'API
- **Exemples de requêtes** : Des exemples sont fournis pour chaque endpoint

### Endpoints principaux

La documentation couvre les endpoints suivants :

- **/auth** : Inscription et connexion des utilisateurs
- **/products** : Gestion du catalogue de produits
- **/cart** : Gestion du panier d'achat
- **/orders** : Gestion des commandes
- **/users** : Gestion des utilisateurs

## Structure du projet

```
breizhsport/
├── backend/                # API Nest.js
│   ├── src/
│   │   ├── auth/           # Authentification
│   │   ├── products/       # Gestion des produits
│   │   ├── users/          # Gestion des utilisateurs
│   │   ├── cart/           # Gestion du panier
│   │   └── orders/         # Gestion des commandes
│   └── ...
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/            # Pages de l'application
│   │   ├── components/     # Composants réutilisables
│   │   └── types/          # Types TypeScript
│   └── ...
├── .github/                # Configuration CI/CD
│   └── workflows/          # Workflows GitHub Actions
├── prometheus/             # Configuration Prometheus
├── grafana/                # Configuration Grafana
└── docker-compose.yml      # Configuration Docker Compose
```

## Monitoring et Métriques

Le projet intègre un système complet de monitoring et de métriques basé sur Prometheus et Grafana pour surveiller les performances et la santé de l'application.

### Fonctionnalités de Monitoring

- **Vérification de santé (Health Check)** : Accessible via `/monitoring/health`, cette API vérifie l'état de la base de données et d'autres services critiques.
- **Métriques Prometheus** : Accessibles via `/metrics`, ces métriques fournissent des informations détaillées sur les performances de l'application.
- **Métriques collectées** :
  - `http_requests_total` : Nombre total de requêtes HTTP par méthode, route et code de statut.
  - `http_request_duration_seconds` : Durée des requêtes HTTP en secondes.
  - `active_users` : Nombre d'utilisateurs actifs sur la plateforme.

### Dashboards Grafana

Nous avons configuré plusieurs dashboards Grafana pour visualiser les métriques importantes :

1. **Dashboard Application** : Vue d'ensemble des performances de l'application
2. **Dashboard Base de données** : Métriques PostgreSQL (connexions, requêtes, latence)
3. **Dashboard Infrastructure** : Utilisation des ressources (CPU, mémoire, réseau)
4. **Dashboard Business** : Métriques métier (commandes, utilisateurs, produits)

## Contribuer

1. Forker le dépôt
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'feat: add amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
