import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation(() => 'hashed_password'),
  compare: jest.fn().mockImplementation(() => true),
}));

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral,
>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const newUser = {
        id: '1',
        ...createUserDto,
        password: 'hashed_password',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.create!.mockReturnValue(newUser);
      userRepository.save!.mockResolvedValue(newUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(newUser);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'user',
          isActive: true,
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          role: 'admin',
          isActive: true,
        },
      ];

      userRepository.find!.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledWith({
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'address',
          'phone',
          'role',
          'isActive',
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      };

      userRepository.findOne!.mockResolvedValue(user);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'address',
          'phone',
          'role',
          'isActive',
        ],
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'user',
        isActive: true,
      };

      userRepository.findOne!.mockResolvedValue(user);

      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'password',
          'address',
          'phone',
          'role',
          'isActive',
        ],
      });
    });

    it('should return null if user is not found by email', async () => {
      userRepository.findOne!.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        firstName: 'John Updated',
        lastName: 'Doe Updated',
      };

      const existingUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      };

      const updatedUser = {
        ...existingUser,
        ...updateUserDto,
      };

      userRepository.findOne!.mockResolvedValue(existingUser);
      userRepository.save!.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Array),
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should hash password when updating password', async () => {
      const updateUserDto = {
        password: 'newpassword123',
      };

      const existingUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'old_hashed_password',
        role: 'user',
        isActive: true,
      };

      const updatedUser = {
        ...existingUser,
        password: 'hashed_password', // Mocked hash value
      };

      userRepository.findOne!.mockResolvedValue(existingUser);
      userRepository.save!.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      userRepository.findOne!.mockResolvedValue(null);

      await expect(
        service.update('999', { firstName: 'Updated Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      userRepository.delete!.mockResolvedValue({ affected: 1 });

      await service.remove('1');
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user to remove is not found', async () => {
      userRepository.delete!.mockResolvedValue({ affected: 0 });

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
