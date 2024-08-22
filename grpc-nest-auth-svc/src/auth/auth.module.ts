import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from 'path';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from 'src/user/user.pb';
import { AuthController } from './auth.controller';
import { Auth } from "./auth.entity";
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './auth.pb';
import { jwtConstants } from "./constants/constants";
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
        ClientsModule.register([{
            name: USER_SERVICE_NAME,
            transport: Transport.GRPC,
            options: {
                url: 'localhost:50052',
                package: USER_PACKAGE_NAME,
                protoPath: resolve(__dirname, '../../../../grpc-nest-proto/proto/user.proto'),
            },
        },
          {
            name: AUTH_SERVICE_NAME,
            transport: Transport.GRPC,
            options: {
              url: 'localhost:50051',
              package: AUTH_PACKAGE_NAME,
              protoPath: resolve(__dirname, '../../../../grpc-nest-proto/proto/auth.proto'),
            },
          }
        ]),
        TypeOrmModule.forFeature([Auth, Role]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy],
})
export class AuthModule {}
