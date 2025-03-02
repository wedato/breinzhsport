import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';

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

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: MockRepository<Order>;
  let orderItemRepository: MockRepository<OrderItem>;
  let userRepository: MockRepository<User>;
  let cartService: Partial<CartService>;

  beforeEach(async () => {
    cartService = {
      getCart: jest.fn(),
      clearCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: CartService,
          useValue: cartService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<MockRepository<Order>>(
      getRepositoryToken(Order),
    );
    orderItemRepository = module.get<MockRepository<OrderItem>>(
      getRepositoryToken(OrderItem),
    );
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order from cart items', async () => {
      const userId = '1';
      const createOrderDto: CreateOrderDto = {
        shippingAddress: '12 rue de la Paix, 75000 Paris',
        deliveryInstructions: 'Interphone 4B',
      };

      const user = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '10 rue de Rivoli, 75001 Paris',
      };

      const product = {
        id: '1',
        name: 'Ballon de football',
        price: 29.99,
        images: ['ballon.jpg'],
        isActive: true,
      };

      const cartItems = [
        {
          id: '1',
          product,
          quantity: 2,
          price: 29.99,
        },
      ];

      const cart = {
        id: '1',
        user: { id: userId },
        items: cartItems,
      };

      const newOrder = {
        id: '1',
        user,
        status: OrderStatus.PENDING,
        shippingAddress: createOrderDto.shippingAddress,
        deliveryInstructions: createOrderDto.deliveryInstructions,
        total: 59.98,
        items: [],
      };

      const orderItem = {
        id: '1',
        order: newOrder,
        product,
        quantity: 2,
        price: 29.99,
        total: 59.98,
      };

      const savedOrder = {
        ...newOrder,
        items: [orderItem],
      };

      userRepository.findOne!.mockResolvedValue(user);
      cartService.getCart = jest.fn().mockResolvedValue(cart);
      orderRepository.create!.mockReturnValue(newOrder);
      orderRepository.save!.mockResolvedValue(newOrder);
      orderItemRepository.create!.mockReturnValue(orderItem);
      orderItemRepository.save!.mockResolvedValue([orderItem]);
      cartService.clearCart = jest.fn().mockResolvedValue({});
      orderRepository.findOne!.mockResolvedValue(savedOrder);

      const result = await service.create(userId, createOrderDto);
      expect(result).toEqual(savedOrder);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(cartService.getCart).toHaveBeenCalledWith(userId);
      expect(orderRepository.create).toHaveBeenCalledWith({
        user,
        status: OrderStatus.PENDING,
        shippingAddress: createOrderDto.shippingAddress,
        deliveryInstructions: createOrderDto.deliveryInstructions,
        total: 59.98,
      });
      expect(orderItemRepository.create).toHaveBeenCalledWith({
        order: newOrder,
        product,
        quantity: 2,
        price: 29.99,
        total: 59.98,
      });
      expect(cartService.clearCart).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '999';
      const createOrderDto: CreateOrderDto = {
        shippingAddress: '12 rue de la Paix, 75000 Paris',
      };

      userRepository.findOne!.mockResolvedValue(null);

      await expect(service.create(userId, createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if cart is empty', async () => {
      const userId = '1';
      const createOrderDto: CreateOrderDto = {
        shippingAddress: '12 rue de la Paix, 75000 Paris',
      };

      const user = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '10 rue de Rivoli, 75001 Paris',
      };

      const cart = {
        id: '1',
        user: { id: userId },
        items: [],
      };

      userRepository.findOne!.mockResolvedValue(user);
      cartService.getCart = jest.fn().mockResolvedValue(cart);

      await expect(service.create(userId, createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllByUser', () => {
    it('should return all orders for a user', async () => {
      const userId = '1';
      const orders = [
        {
          id: '1',
          user: { id: userId },
          status: OrderStatus.PENDING,
          total: 59.98,
          items: [],
        },
        {
          id: '2',
          user: { id: userId },
          status: OrderStatus.SHIPPED,
          total: 129.99,
          items: [],
        },
      ];

      orderRepository.find!.mockResolvedValue(orders);

      const result = await service.findAllByUser(userId);
      expect(result).toEqual(orders);
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const userId = '1';
      const orderId = '1';
      const order = {
        id: orderId,
        user: { id: userId },
        status: OrderStatus.PENDING,
        total: 59.98,
        items: [],
      };

      orderRepository.findOne!.mockResolvedValue(order);

      const result = await service.findOne(userId, orderId);
      expect(result).toEqual(order);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderId, user: { id: userId } },
        relations: ['items', 'items.product'],
      });
    });

    it('should throw NotFoundException if order is not found', async () => {
      const userId = '1';
      const orderId = '999';

      orderRepository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(userId, orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
