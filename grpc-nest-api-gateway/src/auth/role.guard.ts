/*
https://docs.nestjs.com/guards#guards
*/

import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/config/role.decorator';
import {IS_PUBLIC_KEY} from "../config/public.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request: CustomRequest = context.switchToHttp().getRequest();

    const requestedRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getClass(),
      context.getHandler()]);
    console.log('Requested Roles:', requestedRoles);

    const userRole = request.user.roleId;
    if (!userRole) {
      console.log('User or roleId not found in request');
      return false;
    }
    console.log('Role User: ', userRole);

    if (requestedRoles !== userRole) {
      throw new ForbiddenException('Access denied');
    }

    console.log('ROLE GUARD');
    return true;
  }
}

//Custom Request
interface CustomRequest extends Request {
  user: { id: number, roleId: number };
}
