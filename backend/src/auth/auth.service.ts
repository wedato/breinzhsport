import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }

    // Créer le nouvel utilisateur
    const user = await this.usersService.create(createUserDto);

    // Générer le token JWT
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    console.log('Tentative de connexion pour:', loginDto.email);

    const user = await this.usersService.findByEmail(loginDto.email);
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

    if (!user) {
      console.log('Utilisateur non trouvé');
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    console.log('Vérification du mot de passe...');
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    console.log('Mot de passe valide:', isPasswordValid ? 'Oui' : 'Non');

    if (!isPasswordValid) {
      console.log('Mot de passe invalide');
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    console.log('Génération du token JWT...');
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  private generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
