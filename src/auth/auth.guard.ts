import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      //const token = this.extractTokenFromHeader(request);
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);
      request.decodedData = resp;
      return true;
    }
    catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(error.message || 'session expired! Please sign In');
    }
  }

  //   if (!token) {
  //
  //     console.log('No token found');
  //     throw new UnauthorizedException();
  //   }
  //   try {
  //     const payload = await this.jwtService.verifyAsync(
  //       token);
  //     console.log(token);
  //     request['user'] = payload;
  //   } catch {
  //     throw new UnauthorizedException();
  //   }
  //   return true;
  // }
  //
  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }


}