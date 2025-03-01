import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 2,
    description: 'Nouvelle quantité du produit',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
