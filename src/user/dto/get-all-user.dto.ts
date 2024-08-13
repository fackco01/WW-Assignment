import { IsNotEmpty, IsString } from "class-validator";
import { Exclude } from "class-transformer";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


export class GetUserDto {

  @Exclude()
  userId: number;

  username: string;

  name: string;

  @Exclude()
  password: string;

  roleId: number;


  }
