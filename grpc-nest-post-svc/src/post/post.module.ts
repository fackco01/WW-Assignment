import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { Post } from './entity/post.entity';
import { PostController } from './post.controller';
import { POST_PACKAGE_NAME, POST_SERVICE_NAME } from './post.pb';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    ClientsModule.register([{
      name: POST_SERVICE_NAME,
      transport: Transport.GRPC,
      options: {
        url: 'localhost:50053',
        package: POST_PACKAGE_NAME,
        protoPath: resolve(__dirname, '../../../../grpc-nest-proto/proto/post.proto'),
      },
    }])
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
