import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/dto/create-user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('Rôles requis:', requiredRoles);

    if (!requiredRoles) {
      console.log('Aucun rôle requis, accès autorisé');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User dans la requête:', user);
    console.log('Token dans la requête:', request.headers.authorization);

    if (!user) {
      console.log("Pas d'utilisateur trouvé dans la requête");
      return false;
    }

    console.log("Rôle de l'utilisateur:", user.role);
    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('Accès autorisé ?', hasRole);

    return hasRole;
  }
}
