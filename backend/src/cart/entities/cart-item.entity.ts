import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cart_items')
export class CartItem {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "Identifiant unique de l'article du panier",
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Panier auquel appartient cet article',
    type: () => Cart,
  })
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ApiProperty({
    description: 'Produit ajouté au panier',
    type: () => Product,
  })
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ApiProperty({
    example: 2,
    description: 'Quantité du produit dans le panier',
  })
  @Column()
  quantity: number;

  @ApiProperty({
    example: 29.99,
    description: 'Prix unitaire du produit',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: "Date d'ajout au panier",
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
