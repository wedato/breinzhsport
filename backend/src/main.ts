import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import seedProducts from './seed/seed-products';

async function bootstrap() {
  try {
    console.log("Démarrage de l'application NestJS...");
    const app = await NestFactory.create(AppModule);
    console.log('Application NestJS créée avec succès');

    // Configuration CORS
    app.enableCors();
    console.log('CORS activé');

    // Configuration de la validation globale
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('Validation globale configurée');

    // Configuration Swagger
    const config = new DocumentBuilder()
      .setTitle('BreizhSport API')
      .setDescription('API pour la plateforme e-commerce BreizhSport')
      .setVersion('1.0')
      .addTag('products', 'Gestion des produits')
      .addTag('users', 'Gestion des utilisateurs')
      .addTag('orders', 'Gestion des commandes')
      .addTag('cart', 'Gestion du panier')
      .addTag('monitoring', 'Monitoring et métriques')
      .addBearerAuth()
      .addServer('http://localhost:3001', 'Serveur de développement')
      .addServer('https://breizhsport.com/api', 'Serveur de production')
      .setContact(
        'Équipe BreizhSport',
        'https://breizhsport.com',
        'contact@breizhsport.com',
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        deepLinking: true,
      },
      customSiteTitle: 'Breizhsport API Documentation',
      customCss: '.swagger-ui .topbar { display: none }',
      customfavIcon: 'https://breizhsport.fr/favicon.ico',
    });
    console.log('Swagger configuré');

    // Initialisation des produits si nécessaire
    try {
      console.log('Vérification et initialisation des produits...');
      await seedProducts();
      console.log('Initialisation des produits terminée');
    } catch (error) {
      console.error("Erreur lors de l'initialisation des produits:", error);
    }

    // Démarrage du serveur
    const port = process.env.PORT || 3001;
    console.log(`Tentative de démarrage du serveur sur le port ${port}...`);
    await app.listen(port, '0.0.0.0');
    console.log(`L'application est disponible sur: ${await app.getUrl()}`);
    console.log(
      `La documentation Swagger est disponible sur: ${await app.getUrl()}/api`,
    );
    console.log(
      `Les métriques Prometheus sont disponibles sur: ${await app.getUrl()}/metrics`,
    );
  } catch (error) {
    console.error("Erreur lors du démarrage de l'application:", error);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason) => {
  console.error('Promesse non gérée rejetée:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Exception non capturée:', error);
  process.exit(1);
});

bootstrap();
