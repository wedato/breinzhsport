import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../src/products/entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productRepository: Repository<Product>;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    productRepository = moduleFixture.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await productRepository.query('DELETE FROM products');
  });

  it('/products (GET) should return an empty array initially', () => {
    return request(app.getHttpServer()).get('/products').expect(200).expect([]);
  });

  it('/products (POST) should create a new product', async () => {
    const createProductDto = {
      name: 'Ballon de football',
      description: 'Ballon officiel de la Ligue 1',
      price: 29.99,
      category: 'Football',
      brand: 'Adidas',
      stock: 50,
      images: ['ballon.jpg'],
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(createProductDto.name);
    expect(response.body.price).toBe(createProductDto.price);
    expect(response.body.isActive).toBe(true);

    productId = response.body.id;
  });

  it('/products (GET) should return an array with the created product', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Ballon de football');
  });

  it('/products/:id (GET) should return a single product', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe('Ballon de football');
  });

  it('/products/:id (PATCH) should update a product', async () => {
    const updateProductDto = {
      name: 'Ballon de football pro',
      price: 39.99,
    };

    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send(updateProductDto)
      .expect(200);

    expect(response.body.name).toBe(updateProductDto.name);
    expect(response.body.price).toBe(updateProductDto.price);
    expect(response.body.description).toBe('Ballon officiel de la Ligue 1'); // Inchangé
  });

  it('/products/:id (DELETE) should delete a product', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200);

    // Vérifier que le produit a bien été supprimé
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toHaveLength(0);
  });

  it('/products/:id (GET) should return 404 for non-existent product', () => {
    return request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(404);
  });

  it('/products/category/:category (GET) should return products by category', async () => {
    // Créer un produit pour le test
    const createProductDto = {
      name: 'Maillot de football',
      description: "Maillot officiel de l'équipe de France",
      price: 89.99,
      category: 'Football',
      brand: 'Nike',
      stock: 30,
      images: ['maillot.jpg'],
    };

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    // Tester la recherche par catégorie
    const response = await request(app.getHttpServer())
      .get('/products/category/Football')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].category).toBe('Football');
  });

  it('/products/search/:term (GET) should return products matching search term', async () => {
    // Créer un produit pour le test
    const createProductDto = {
      name: 'Chaussures de running',
      description: 'Chaussures légères pour la course',
      price: 119.99,
      category: 'Running',
      brand: 'Nike',
      stock: 20,
      images: ['chaussures.jpg'],
    };

    await request(app.getHttpServer())
      .post('/products')
      .send(createProductDto)
      .expect(201);

    // Tester la recherche par terme
    const response = await request(app.getHttpServer())
      .get('/products/search/running')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Chaussures de running');
  });
});
