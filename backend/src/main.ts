import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import seedProducts from './seed/seed-products';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors();

  // Configuration de la validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Breizhsport API')
    .setDescription(
      `
      API de la plateforme e-commerce Breizhsport.
      
      ## Fonctionnalités principales
      
      ### Produits
      - Gestion du catalogue de produits
      - Recherche et filtrage
      - Gestion des catégories
      
      ### Utilisateurs
      - Inscription et authentification
      - Gestion des profils
      - Gestion des adresses
      
      ### Panier
      - Ajout/suppression d'articles
      - Gestion des quantités
      - Calcul des totaux
      
      ### Commandes
      - Création de commandes
      - Suivi des commandes
      - Historique des achats
    `,
    )
    .setVersion('1.0')
    .addTag('products', 'Gestion des produits')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('cart', 'Gestion du panier')
    .addTag('orders', 'Gestion des commandes')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Breizhsport API Documentation',
  });

  // Initialisation des produits si nécessaire
  try {
    console.log('Vérification et initialisation des produits...');
    await seedProducts();
  } catch (error) {
    console.error("Erreur lors de l'initialisation des produits:", error);
  }

  // Démarrage du serveur
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application démarrée sur le port ${port}`);
  console.log(
    `Documentation Swagger disponible sur http://localhost:${port}/api`,
  );
}
bootstrap();
