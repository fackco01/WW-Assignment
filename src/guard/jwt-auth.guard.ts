import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
     const request = context.switchToHttp().getRequest();
     return super.canActivate(context);
   }
}
