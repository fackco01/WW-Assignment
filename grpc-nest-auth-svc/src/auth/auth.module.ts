import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants/constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "./auth.entity";
import { Role } from "./role.entity";
import { AuthService } from "./service/auth.service";
import { JwtService } from "./service/jwt.service";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
        TypeOrmModule.forFeature([Auth, Role]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
