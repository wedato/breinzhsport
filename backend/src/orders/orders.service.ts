import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cartService: CartService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) {
      throw new NotFoundException('Le panier est vide');
    }

    const order = this.orderRepository.create({
      user,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress || user.address,
      deliveryInstructions: createOrderDto.deliveryInstructions,
      total: cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = cart.items.map((cartItem) =>
      this.orderItemRepository.create({
        order: savedOrder,
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
        total: cartItem.product.price * cartItem.quantity,
      }),
    );

    savedOrder.items = await this.orderItemRepository.save(orderItems);
    await this.cartService.clearCart(userId);

    const finalOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    });

    if (!finalOrder) {
      throw new NotFoundException('Erreur lors de la création de la commande');
    }

    return finalOrder;
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Commande non trouvée');
    }

    return order;
  }
}
