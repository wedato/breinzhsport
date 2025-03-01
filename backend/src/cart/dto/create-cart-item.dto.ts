import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID du produit à ajouter au panier',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 1,
    description: 'Quantité du produit à ajouter',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
