import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./auth/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
      }),

    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     host: configService.get<string>('database.host'),
    //     port: configService.get<number>('database.port'),
    //     username: configService.get<string>('database.username'),
    //     password: configService.get<string>('database.password'),
    //     database: configService.get<string>('database.name'),
    //     entities: [User],
    //     synchronize: configService.get<boolean>('database.synchronize'),
    //   }),
    //   inject: [ConfigService],
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'duan0406',
      database: 'wowi',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
