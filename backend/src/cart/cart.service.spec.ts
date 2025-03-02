import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

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
  remove: jest.fn(),
});

describe('CartService', () => {
  let service: CartService;
  let cartRepository: MockRepository<Cart>;
  let cartItemRepository: MockRepository<CartItem>;
  let productRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<MockRepository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<MockRepository<CartItem>>(
      getRepositoryToken(CartItem),
    );
    productRepository = module.get<MockRepository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should return an existing cart for a user', async () => {
      const userId = '1';
      const mockCart = {
        id: '1',
        user: { id: userId },
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartRepository.findOne!.mockResolvedValue(mockCart);

      const result = await service.getCart(userId);
      expect(result).toEqual(mockCart);
      expect(cartRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });
    });

    it('should create a new cart if none exists for the user', async () => {
      const userId = '1';
      const newCart = {
        id: '1',
        user: { id: userId },
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartRepository.findOne!.mockResolvedValue(null);
      cartRepository.create!.mockReturnValue(newCart);
      cartRepository.save!.mockResolvedValue(newCart);

      const result = await service.getCart(userId);
      expect(result).toEqual(newCart);
      expect(cartRepository.create).toHaveBeenCalledWith({
        user: { id: userId },
        items: [],
      });
      expect(cartRepository.save).toHaveBeenCalledWith(newCart);
    });
  });

  describe('addToCart', () => {
    it('should add a new item to the cart', async () => {
      const userId = '1';
      const productId = '1';
      const createCartItemDto: CreateCartItemDto = {
        productId,
        quantity: 2,
      };

      const product = {
        id: productId,
        name: 'Ballon de football',
        price: 29.99,
        images: ['ballon.jpg'],
        isActive: true,
      };

      const cart = {
        id: '1',
        user: { id: userId },
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newCartItem = {
        id: '1',
        cart,
        product,
        quantity: 2,
        price: 29.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCart = {
        ...cart,
        items: [newCartItem],
      };

      cartRepository.findOne!.mockResolvedValue(cart);
      productRepository.findOne!.mockResolvedValue(product);
      cartItemRepository.create!.mockReturnValue(newCartItem);
      cartRepository.save!.mockResolvedValue(updatedCart);

      // Pour le second appel à getCart
      cartRepository.findOne!.mockResolvedValueOnce(updatedCart);

      const result = await service.addToCart(userId, createCartItemDto);
      expect(result).toEqual(updatedCart);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(cartItemRepository.create).toHaveBeenCalledWith({
        cart,
        product,
        quantity: 2,
        price: 29.99,
      });
      expect(cartRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product is not found', async () => {
      const userId = '1';
      const createCartItemDto: CreateCartItemDto = {
        productId: '999',
        quantity: 2,
      };

      const cart = {
        id: '1',
        user: { id: userId },
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartRepository.findOne!.mockResolvedValue(cart);
      productRepository.findOne!.mockResolvedValue(null);

      await expect(
        service.addToCart(userId, createCartItemDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCartItem', () => {
    it('should update an item in the cart', async () => {
      const userId = '1';
      const itemId = '1';
      const updateCartItemDto: UpdateCartItemDto = {
        quantity: 3,
      };

      const product = {
        id: '1',
        name: 'Ballon de football',
        price: 29.99,
        images: ['ballon.jpg'],
        isActive: true,
      };

      const cartItem = {
        id: itemId,
        product,
        quantity: 2,
        price: 29.99,
      };

      const cart = {
        id: '1',
        user: { id: userId },
        items: [cartItem],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCartItem = {
        ...cartItem,
        quantity: 3,
      };

      const updatedCart = {
        ...cart,
        items: [updatedCartItem],
      };

      cartRepository.findOne!.mockResolvedValue(cart);
      cartItemRepository.save!.mockResolvedValue(updatedCartItem);

      // Pour le second appel à getCart
      cartRepository.findOne!.mockResolvedValueOnce(updatedCart);

      const result = await service.updateCartItem(
        userId,
        itemId,
        updateCartItemDto,
      );
      expect(result).toEqual(updatedCart);
      expect(cartItemRepository.save).toHaveBeenCalledWith({
        ...cartItem,
        quantity: 3,
        price: 29.99,
      });
    });

    it('should throw NotFoundException if item is not found in cart', async () => {
      const userId = '1';
      const itemId = '999';
      const updateCartItemDto: UpdateCartItemDto = {
        quantity: 3,
      };

      const cart = {
        id: '1',
        user: { id: userId },
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartRepository.findOne!.mockResolvedValue(cart);

      await expect(
        service.updateCartItem(userId, itemId, updateCartItemDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', async () => {
      const userId = '1';
      const itemId = '1';

      const cartItem = {
        id: itemId,
        product: {
          id: '1',
          name: 'Ballon de football',
          price: 29.99,
          images: ['ballon.jpg'],
          isActive: true,
        },
        quantity: 2,
        price: 29.99,
      };

      const cart = {
        id: '1',
        user: { id: userId },
        items: [cartItem],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const emptyCart = {
        ...cart,
        items: [],
      };

      cartRepository.findOne!.mockResolvedValue(cart);
      cartItemRepository.remove!.mockResolvedValue(cartItem);

      // Pour le second appel à getCart
      cartRepository.findOne!.mockResolvedValueOnce(emptyCart);

      const result = await service.removeFromCart(userId, itemId);
      expect(result).toEqual(emptyCart);
      expect(cartItemRepository.remove).toHaveBeenCalledWith(cartItem);
    });

    it('should throw NotFoundException if item is not found in cart', async () => {
      const userId = '1';
      const itemId = '999';

      const cart = {
        id: '1',
        user: { id: userId },
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      cartRepository.findOne!.mockResolvedValue(cart);

      await expect(service.removeFromCart(userId, itemId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearCart', () => {
    it('should clear all items from the cart', async () => {
      const userId = '1';

      const cartItems = [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Ballon de football',
            price: 29.99,
            images: ['ballon.jpg'],
            isActive: true,
          },
          quantity: 2,
          price: 29.99,
        },
      ];

      const cart = {
        id: '1',
        user: { id: userId },
        items: cartItems,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const emptyCart = {
        ...cart,
        items: [],
      };

      cartRepository.findOne!.mockResolvedValue(cart);
      cartItemRepository.remove!.mockResolvedValue(cartItems);
      cartRepository.save!.mockResolvedValue(emptyCart);

      const result = await service.clearCart(userId);
      expect(result).toEqual(emptyCart);
      expect(cartItemRepository.remove).toHaveBeenCalledWith(cartItems);
      expect(cartRepository.save).toHaveBeenCalledWith({
        ...cart,
        items: [],
      });
    });
  });
});
