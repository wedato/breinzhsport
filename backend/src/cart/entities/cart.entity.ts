import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('carts')
export class Cart {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique du panier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Utilisateur propriétaire du panier',
    type: () => User,
  })
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ApiProperty({
    description: 'Articles dans le panier',
    type: [CartItem],
  })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date de création du panier',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Date de dernière mise à jour du panier',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
