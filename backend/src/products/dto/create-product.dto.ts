import { IsString, IsNumber, IsArray, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Ballon de football Nike Strike',
    description: 'Nom du produit',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Ballon officiel de la Ligue 1, design moderne et durable',
    description: 'Description détaillée du produit',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 29.99,
    description: 'Prix du produit en euros',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'Football',
    description: 'Catégorie du produit',
    enum: ['Football', 'Basketball', 'Tennis', 'Running', 'Fitness'],
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: 'Nike',
    description: 'Marque du produit',
  })
  @IsString()
  brand: string;

  @ApiProperty({
    example: 100,
    description: 'Quantité en stock',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Liste des URLs des images du produit',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}
