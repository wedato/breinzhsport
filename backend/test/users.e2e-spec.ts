import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await userRepository.query('DELETE FROM users');
  });

  it('/users (GET) should return an empty array initially', () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect([]);
  });

  it('/users (POST) should create a new user', async () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe(createUserDto.firstName);
    expect(response.body.lastName).toBe(createUserDto.lastName);
    expect(response.body.email).toBe(createUserDto.email);
    expect(response.body).not.toHaveProperty('password'); // Le mot de passe ne doit pas être renvoyé
    expect(response.body.role).toBe('user');
    expect(response.body.isActive).toBe(true);

    userId = response.body.id;
  });

  it('/users (GET) should return an array with the created user', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].firstName).toBe('John');
    expect(response.body[0].lastName).toBe('Doe');
    expect(response.body[0]).not.toHaveProperty('password');
  });

  it('/users/:id (GET) should return a single user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);

    expect(response.body.id).toBe(userId);
    expect(response.body.firstName).toBe('John');
    expect(response.body.lastName).toBe('Doe');
    expect(response.body).not.toHaveProperty('password');
  });

  it('/users/:id (PATCH) should update a user', async () => {
    const updateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '12 rue de la Paix, 75000 Paris',
      phone: '+33612345678',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body.firstName).toBe(updateUserDto.firstName);
    expect(response.body.lastName).toBe(updateUserDto.lastName);
    expect(response.body.address).toBe(updateUserDto.address);
    expect(response.body.phone).toBe(updateUserDto.phone);
    expect(response.body.email).toBe('john.doe@example.com'); // Inchangé
  });

  it('/users/:id (DELETE) should delete a user', async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(200);

    // Vérifier que l'utilisateur a bien été supprimé
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toHaveLength(0);
  });

  it('/users/:id (GET) should return 404 for non-existent user', () => {
    return request(app.getHttpServer()).get(`/users/${userId}`).expect(404);
  });

  it('/users (POST) should validate email format', async () => {
    const invalidUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserDto)
      .expect(400);

    expect(response.body.message).toContain('email');
  });

  it('/users (POST) should require password', async () => {
    const invalidUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserDto)
      .expect(400);

    expect(response.body.message).toContain('password');
  });
});
