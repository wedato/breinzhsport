import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // On ne hash plus le mot de passe ici car c'est géré par @BeforeInsert dans l'entité
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'address',
        'phone',
        'role',
        'isActive',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'address',
        'phone',
        'role',
        'isActive',
      ],
    });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'ID ${id} n'existe pas.`,
      );
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('Recherche utilisateur par email:', email);
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'password', // Important : on doit inclure le mot de passe pour la vérification
        'address',
        'phone',
        'role',
        'isActive',
      ],
    });
    console.log(
      'Résultat de la recherche:',
      user ? 'Utilisateur trouvé' : 'Utilisateur non trouvé',
    );
    if (user) {
      console.log('Email trouvé:', user.email);
      console.log('Mot de passe hashé:', user.password ? 'Présent' : 'Absent');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `L'utilisateur avec l'ID ${id} n'existe pas.`,
      );
    }
  }
}
