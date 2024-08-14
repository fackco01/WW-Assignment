import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { AuthGuard } from "../guard/auth.guard";


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
})
export class UserModule {}
