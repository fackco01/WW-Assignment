import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from './user.pb';

@Module({
  imports:[
    ClientsModule.register([{
      name: USER_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50051',
        package: USER_PACKAGE_NAME,
        protoPath: resolve(__dirname, '../../../grpc-nest-proto/proto/user.proto'),
      },
    }]),
  ],
  controllers: [UserController]
})
export class UserModule {}
