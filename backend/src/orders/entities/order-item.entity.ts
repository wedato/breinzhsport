import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderItem {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "Identifiant unique de l'article de commande",
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Commande à laquelle appartient cet article',
    type: () => Order,
  })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ApiProperty({
    description: 'Produit commandé',
    type: () => Product,
  })
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ApiProperty({
    example: 2,
    description: 'Quantité commandée',
  })
  @Column()
  quantity: number;

  @ApiProperty({
    example: 29.99,
    description: 'Prix unitaire du produit au moment de la commande',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: 59.98,
    description: 'Prix total pour cet article (quantité × prix)',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date de création',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Date de dernière mise à jour',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
