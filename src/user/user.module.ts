import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../guard/auth.guard";
import { Role } from "../auth/entities/role.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard, EventEmitter2],
})
export class UserModule {}
