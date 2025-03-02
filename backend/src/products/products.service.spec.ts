import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

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

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<MockRepository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        {
          id: '1',
          name: 'Ballon de football',
          description: 'Ballon officiel de la Ligue 1',
          price: 29.99,
          category: 'Football',
          brand: 'Adidas',
          stock: 50,
          images: ['ballon.jpg'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      productRepository.find!.mockResolvedValue(expectedProducts);

      const products = await service.findAll();
      expect(products).toEqual(expectedProducts);
      expect(productRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const expectedProduct = {
        id: '1',
        name: 'Ballon de football',
        description: 'Ballon officiel de la Ligue 1',
        price: 29.99,
        category: 'Football',
        brand: 'Adidas',
        stock: 50,
        images: ['ballon.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      productRepository.findOne!.mockResolvedValue(expectedProduct);

      const product = await service.findOne('1');
      expect(product).toEqual(expectedProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error if product is not found', async () => {
      productRepository.findOne!.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'Ballon de football',
        description: 'Ballon officiel de la Ligue 1',
        price: 29.99,
        category: 'Football',
        brand: 'Adidas',
        stock: 50,
        images: ['ballon.jpg'],
      };

      const newProduct = {
        id: '1',
        ...createProductDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      productRepository.create!.mockReturnValue(newProduct);
      productRepository.save!.mockResolvedValue(newProduct);

      const result = await service.create(createProductDto);
      expect(result).toEqual(newProduct);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        name: 'Ballon de football pro',
        price: 39.99,
      };

      const existingProduct = {
        id: '1',
        name: 'Ballon de football',
        description: 'Ballon officiel de la Ligue 1',
        price: 29.99,
        category: 'Football',
        brand: 'Adidas',
        stock: 50,
        images: ['ballon.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateProductDto,
        updatedAt: new Date(),
      };

      productRepository.findOne!.mockResolvedValue(existingProduct);
      productRepository.save!.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(productRepository.save).toHaveBeenCalledWith({
        ...existingProduct,
        ...updateProductDto,
      });
    });

    it('should throw an error if product to update is not found', async () => {
      productRepository.findOne!.mockResolvedValue(null);

      await expect(
        service.update('1', { name: 'Updated name' }),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      productRepository.delete!.mockResolvedValue({ affected: 1 });

      await service.remove('1');
      expect(productRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if product to remove is not found', async () => {
      productRepository.delete!.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
