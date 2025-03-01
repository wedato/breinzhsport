import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserRole } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: "Inscription d'un nouvel utilisateur" })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès.',
    schema: {
      example: {
        user: {
          id: 'uuid',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        token: 'jwt_token',
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('register/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Création d'un compte administrateur" })
  @ApiResponse({
    status: 201,
    description: 'Administrateur créé avec succès.',
  })
  async registerAdmin(@Body() createUserDto: CreateUserDto) {
    // Force le rôle admin
    createUserDto.role = UserRole.ADMIN;
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: "Connexion d'un utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie.',
    schema: {
      example: {
        user: {
          id: 'uuid',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        token: 'jwt_token',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
