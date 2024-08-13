import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query, UseGuards,
  UseInterceptors,
  Request,
  Response, HttpStatus, Req, Res
} from "@nestjs/common";
import { UserService } from './user.service';
import { GetUserDto } from "./dto/get-all-user.dto";
import { User } from "../auth/entities/user.entity";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./role.guard";


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

//Get profile
  @UseGuards(JwtAuthGuard)
  //@Roles(1) //Just test Role Authorization. Must have RoleGuard
  //@UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  async findUserId(
    @Req() req
  ) {
    try {
      const user: User = await this.userService.findUserById(req.user.sub);

      if (!user) {
        throw new NotFoundException(`Cannot find user: ${user}`);
      }

      return user;
    } catch (error) {
      throw new NotFoundException(`Cannot find user: ${error.message}`);
    }
  }

}

