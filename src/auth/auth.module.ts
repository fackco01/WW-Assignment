import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { PassportModule } from "@nestjs/passport";
import { AuthGuard } from "../guard/auth.guard";
import { AccessTokenStrategy } from "../guard/jwt-guard.strategy";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationsService } from "../notifications/notifications.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService,AccessTokenStrategy, EventEmitter2, String, NotificationsService],
  exports: [AuthService, JwtService,AccessTokenStrategy, EventEmitter2, String, NotificationsService],
})
export class AuthModule {}
