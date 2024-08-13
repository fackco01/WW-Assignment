import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      console.log(token);

      if (!token) {
        throw new UnauthorizedException();
      }
      request.user = this.jwtService.verify(token);
      console.log(request.user);
      }
    catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(error.message || 'session expired! Please sign In');
    }
    return true;
  }
}
