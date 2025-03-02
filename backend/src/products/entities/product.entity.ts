import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identifiant unique du produit',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Ballon de football Nike Strike',
    description: 'Nom du produit',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Ballon officiel de la Ligue 1, design moderne et durable',
    description: 'Description détaillée du produit',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example: 29.99,
    description: 'Prix du produit en euros',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: 'Football',
    description: 'Catégorie du produit',
  })
  @Column()
  category: string;

  @ApiProperty({
    example: 'Nike',
    description: 'Marque du produit',
  })
  @Column()
  brand: string;

  @ApiProperty({
    example: 100,
    description: 'Quantité en stock',
  })
  @Column('int')
  stock: number;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Liste des URLs des images du produit',
    required: false,
  })
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @ApiProperty({
    example: true,
    description: 'Indique si le produit est actif et disponible à la vente',
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date de création du produit',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Date de dernière mise à jour du produit',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
