import { IsNotEmpty, IsString } from "class-validator";
import { Exclude, Transform } from "class-transformer";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { UserService } from "../user.service";
import { Role } from "../../auth/entities/role.entity";


export class GetUserDto {

  @Exclude()
  userId: number;

  username: string;

  name: string;

  @Exclude()
  password: string;

  @Exclude()
  roleId: number;

  role: string;

  }
