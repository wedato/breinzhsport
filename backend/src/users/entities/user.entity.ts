import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: "Identifiant unique de l'utilisateur",
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'John',
    description: "Prénom de l'utilisateur",
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: "Nom de l'utilisateur",
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "Adresse email de l'utilisateur (unique)",
  })
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @ApiProperty({
    example: 'user',
    description: "Rôle de l'utilisateur (user ou admin)",
  })
  @Column({ default: 'user' })
  role: string;

  @ApiProperty({
    example: '12 rue de la Paix, 75000 Paris',
    description: 'Adresse de livraison',
    required: false,
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    example: '+33612345678',
    description: 'Numéro de téléphone',
    required: false,
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example: true,
    description: 'Indique si le compte utilisateur est actif',
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date de création du compte',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Date de dernière mise à jour du compte',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
