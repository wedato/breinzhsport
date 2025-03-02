import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique de la commande',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Utilisateur ayant passé la commande',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true })
  user: User;

  @ApiProperty({
    description: 'Articles de la commande',
    type: [OrderItem],
  })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @ApiProperty({
    example: 129.99,
    description: 'Montant total de la commande en euros',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    example: 'pending',
    description: 'Statut de la commande',
    enum: OrderStatus,
  })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({
    example: '12 rue de la Paix, 75000 Paris',
    description: 'Adresse de livraison',
    required: false,
  })
  @Column({ nullable: true })
  shippingAddress: string;

  @ApiProperty({
    example: 'Interphone 4B, 2ème étage',
    description: 'Instructions de livraison',
    required: false,
  })
  @Column({ nullable: true })
  deliveryInstructions: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date de création de la commande',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Date de dernière mise à jour de la commande',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
