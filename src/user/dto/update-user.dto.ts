import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateUserDto{

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  roleId: number;
}