import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {join, resolve} from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './user/filter/http-exception.filter';
import { protobufPackage } from './user/user.pb';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: protobufPackage,
      protoPath: join('node_modules/grpc-nest-proto/proto/user.proto'),
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  console.log('gRPC Server is running on: 0.0.0.0:50052');
  await app.listen();
}

bootstrap();
