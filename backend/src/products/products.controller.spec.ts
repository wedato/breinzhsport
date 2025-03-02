import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [
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
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result: Product = {
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
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Ballon de football',
        description: 'Ballon officiel de la Ligue 1',
        price: 29.99,
        category: 'Football',
        brand: 'Adidas',
        stock: 50,
        images: ['ballon.jpg'],
      };

      const result: Product = {
        id: '1',
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        category: createProductDto.category,
        brand: createProductDto.brand,
        stock: createProductDto.stock,
        images: createProductDto.images || [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.create(createProductDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Ballon de football pro',
        price: 39.99,
      };

      const result: Product = {
        id: '1',
        name: 'Ballon de football pro',
        description: 'Ballon officiel de la Ligue 1',
        price: 39.99,
        category: 'Football',
        brand: 'Adidas',
        stock: 50,
        images: ['ballon.jpg'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.update('1', updateProductDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'remove').mockImplementation(() => Promise.resolve());

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
