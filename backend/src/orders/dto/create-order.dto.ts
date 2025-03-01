import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: '12 rue de la Paix, 75000 Paris',
    description:
      "Adresse de livraison (optionnelle, utilise l'adresse du profil par défaut)",
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    example: 'Interphone 4B, 2ème étage',
    description: 'Instructions de livraison (optionnelles)',
    required: false,
  })
  @IsString()
  @IsOptional()
  deliveryInstructions?: string;
}
