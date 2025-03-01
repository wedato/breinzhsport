import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('SeedProducts');

// Liste des produits à insérer
const products = [
  {
    name: 'Ballon de football Pro',
    description:
      'Ballon de football professionnel, idéal pour les matchs officiels',
    price: 29.99,
    category: 'Football',
    brand: 'Nike',
    stock: 100,
    images: ['ballon-football-pro.jpg'],
  },
  {
    name: 'Chaussures de football Predator',
    description:
      'Chaussures de football haut de gamme pour une meilleure précision',
    price: 89.99,
    category: 'Football',
    brand: 'Adidas',
    stock: 50,
    images: ['chaussures-predator.jpg'],
  },
  {
    name: 'Protège-tibias Football',
    description:
      'Protège-tibias légers et résistants pour une protection optimale',
    price: 14.99,
    category: 'Football',
    brand: 'Puma',
    stock: 150,
    images: ['protege-tibias.jpg'],
  },
  {
    name: 'Ballon de basketball NBA',
    description: 'Ballon de basketball officiel de la NBA',
    price: 39.99,
    category: 'Basketball',
    brand: 'Nike',
    stock: 80,
    images: ['ballon-nba.jpg'],
  },
  {
    name: 'Chaussures de basketball Air Jordan',
    description:
      'Chaussures de basketball iconiques pour des performances exceptionnelles',
    price: 129.99,
    category: 'Basketball',
    brand: 'Nike',
    stock: 30,
    images: ['air-jordan.jpg'],
  },
  {
    name: "Maillot de l'équipe de France",
    description: "Maillot officiel de l'équipe de France de football",
    price: 79.99,
    category: 'Football',
    brand: 'Nike',
    stock: 60,
    images: ['maillot-france.jpg'],
  },
  {
    name: 'Raquette de tennis Pro',
    description: 'Raquette de tennis professionnelle pour un contrôle optimal',
    price: 149.99,
    category: 'Tennis',
    brand: 'Wilson',
    stock: 40,
    images: ['raquette-tennis.jpg'],
  },
  {
    name: 'Chaussures de running Performance',
    description:
      'Chaussures de course légères et confortables pour les longues distances',
    price: 99.99,
    category: 'Running',
    brand: 'Asics',
    stock: 70,
    images: ['chaussures-running.jpg'],
  },
  {
    name: 'Tapis de yoga Premium',
    description: 'Tapis de yoga antidérapant pour une pratique confortable',
    price: 49.99,
    category: 'Fitness',
    brand: 'Lululemon',
    stock: 90,
    images: ['tapis-yoga.jpg'],
  },
  {
    name: 'Gants de boxe Professionnels',
    description:
      'Gants de boxe en cuir véritable pour un entraînement intensif',
    price: 69.99,
    category: 'Boxe',
    brand: 'Everlast',
    stock: 45,
    images: ['gants-boxe.jpg'],
  },
];

/**
 * Fonction pour initialiser les produits dans la base de données
 */
async function seedProducts() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  try {
    // Vérifier si des produits existent déjà
    const existingProducts = await productsService.findAll();

    if (existingProducts.length > 0) {
      logger.log(
        `${existingProducts.length} produits existent déjà dans la base de données. Aucune initialisation nécessaire.`,
      );
    } else {
      logger.log('Aucun produit trouvé. Initialisation des produits...');

      // Insérer chaque produit
      for (const product of products) {
        await productsService.create(product);
        logger.log(`Produit créé: ${product.name}`);
      }

      logger.log(
        `${products.length} produits ont été initialisés avec succès!`,
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue';
    logger.error(
      `Erreur lors de l'initialisation des produits: ${errorMessage}`,
    );
  } finally {
    await app.close();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedProducts()
    .then(() => logger.log("Script d'initialisation des produits terminé"))
    .catch((error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur dans le script d'initialisation: ${errorMessage}`);
    });
}

// Exporter la fonction pour pouvoir l'utiliser ailleurs
export default seedProducts;
