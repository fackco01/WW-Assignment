import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from "./user.pb";
import { UserService } from './user.service';
import {AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME} from "../auth/auth.pb";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
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
                    url: '0.0.0.0:50051',
                    package: AUTH_PACKAGE_NAME,
                    protoPath: resolve(__dirname, '../../../../grpc-nest-proto/proto/auth.proto'),
                },
            }
        ])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
