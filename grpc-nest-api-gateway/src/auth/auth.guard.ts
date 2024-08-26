import { Injectable, CanActivate, ExecutionContext, HttpStatus, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ValidateResponse } from './auth.pb';
import { AuthService } from './auth.service';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../config/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    @Inject(AuthService)
    public readonly service: AuthService;

    public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {

        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, ctx.getHandler());

        if (isPublic) {
            return true;
        }

        const req: CustomRequest  = ctx.switchToHttp().getRequest();
        const authorization: string = req.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException();
        }

        const bearer: string[] = authorization.split(' ');

        if (!bearer || bearer.length < 2) {
            throw new UnauthorizedException();
        }

        const token: string = bearer[1];

        const { status, userId, roleId }: ValidateResponse = await this.service.validate(token);

        if (status !== 200 || !userId || !roleId) {
            throw new UnauthorizedException('Invalid token or user information');
        }

        req.user = { id: userId, roleId: roleId };

        if (status !== HttpStatus.OK) {
            throw new UnauthorizedException();
        }

        return true;
    }
}

//Custom Request
interface CustomRequest extends Request {
    user: { id: number, roleId: number };
}
