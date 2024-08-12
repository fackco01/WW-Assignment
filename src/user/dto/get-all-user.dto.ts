import { IsNotEmpty, IsString } from "class-validator";
import { Exclude } from "class-transformer";
import { User } from "../../auth/entities/user.entity";


export class GetUserDto {

  @Exclude()
  userId: number;

  username: string;

  name: string;

  @Exclude()
  password: string;

  roleId: number;

  toEntity(dto: GetUserDto) {
    const user = new User();
    user.userId = this.userId;
    user.username = this.username;
    user.name = this.name;
    user.password = this.password;
    user.roleId = this.roleId;
    return user;
  }

  fromEntity(entity: User){
    const dto = new GetUserDto();
    dto.userId = entity.userId;
    dto.username = entity.username;
    dto.name = entity.name;
    dto.password = entity.password;
    dto.roleId = entity.roleId;
  }
}