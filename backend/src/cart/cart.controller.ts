import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @ApiOperation({ summary: 'Ajouter un produit au panier' })
  @ApiResponse({
    status: 201,
    description: 'Produit ajouté au panier avec succès.',
  })
  addToCart(@Request() req, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addToCart(req.user.id, createCartItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer le contenu du panier' })
  @ApiResponse({
    status: 200,
    description: 'Contenu du panier récupéré avec succès.',
  })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch('items/:id')
  @ApiOperation({
    summary: "Mettre à jour la quantité d'un produit dans le panier",
  })
  @ApiResponse({
    status: 200,
    description: 'Quantité mise à jour avec succès.',
  })
  updateCartItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Supprimer un produit du panier' })
  @ApiResponse({
    status: 200,
    description: 'Produit supprimé du panier avec succès.',
  })
  removeFromCart(@Request() req, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Vider le panier' })
  @ApiResponse({ status: 200, description: 'Panier vidé avec succès.' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
