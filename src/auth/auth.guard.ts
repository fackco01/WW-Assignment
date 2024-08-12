import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }
    try {
      const user = await this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
