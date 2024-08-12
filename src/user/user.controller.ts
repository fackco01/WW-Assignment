import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { UserService } from './user.service';
import { GetUserDto } from "./dto/get-all-user.dto";
import { User } from "../auth/entities/user.entity";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./role.guard";
import { AuthGuard } from "../auth/auth.guard";

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //get All
  @Get()
  async findAllUser(
    @Query() query: GetUserDto
  ): Promise<GetUserDto[]> {
    try{
      const users: User[] = await this.userService.findAllUser();
      const showUsers = users.map(user => {
        const dto = new GetUserDto();
        dto.userId = user.userId;
        dto.username = user.username;
        dto.name = user.name;
        dto.password = user.password;
        dto.roleId = user.roleId;
        return dto;
      });
      return showUsers;
    }
    catch (error) {
      throw new NotFoundException(`Cannot find user: ${error}`);
    }
  }

  //get By Id
  @UseGuards(AuthGuard)
  @Get(':id')
  async findUserId(
    @Param('id') id: number
  ): Promise<GetUserDto> {
    try{
      const user: User = await this.userService.findUserById(id);
      const dto = new GetUserDto();
      dto.userId = user.userId;
      dto.username = user.username;
      dto.name = user.name;
      dto.password = user.password;
      dto.roleId = user.roleId;
      return dto;
    }
    catch (error) {
      throw new NotFoundException(`Cannot find user: ${error}`);
    }
  }
}
