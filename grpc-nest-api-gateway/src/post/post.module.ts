import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { POST_PACKAGE_NAME, POST_SERVICE_NAME } from './post.pb';

@Module({
  imports:[
    ClientsModule.register([{
      name: POST_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50053',
        package: POST_PACKAGE_NAME,
        protoPath: resolve(__dirname, '../../../grpc-nest-proto/proto/post.proto'),
      }
    }])
  ],
  controllers: [PostController],
})
export class PostModule {}
