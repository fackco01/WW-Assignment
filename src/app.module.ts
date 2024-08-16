import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from './user/user.module';
import configuration from "./config/configuration";
import { JwtModule } from "@nestjs/jwt";
import { dataSourceOptions } from "../db/dataSource-local";
import { CacheModule } from "@nestjs/cache-manager";
import {redisStore} from "cache-manager-redis-yet";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { NotificationsModule } from './notifications/notifications.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from "@nestjs/platform-express";
import { jwtConstants } from "./constants";
import multer from "multer";
import * as path from "node:path";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
      }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    CacheModule.register({
      isGlobal: true,
      //store: redisStore, //For Microservice.
      //ttl:30 * 1000,
    }),
    EventEmitterModule.forRoot(),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
      }),
    }),

    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    NotificationsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
