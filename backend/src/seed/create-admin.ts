import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../users/dto/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);

  try {
    const admin = await authService.register({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@breizhsport.fr',
      password: 'Admin123!',
      role: UserRole.ADMIN,
    });

    console.log('Admin créé avec succès:', admin);
  } catch (error: any) {
    console.error("Erreur lors de la création de l'admin:", error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
