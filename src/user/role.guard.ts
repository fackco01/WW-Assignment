import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext)
    : boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestedRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler()]);
    console.log('Requested Roles:', requestedRoles);

    const userRole = request.user.roleId;
    console.log('Role User: ', userRole);

    if(requestedRoles !== userRole) {
      return false;
    }

    console.log('ROLE GUARD');
    return true;
  }
}