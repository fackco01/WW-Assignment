import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query, UseGuards,
  UseInterceptors,
  Request,
  Response, HttpStatus, Req, Res, Patch, Body, Delete
} from "@nestjs/common";
import { UserService } from './user.service';
import { GetUserDto } from "./dto/get-all-user.dto";
import { User } from "../auth/entities/user.entity";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { AuthGuard } from "../guard/auth.guard";
import { Roles } from "../config/roles.decorator";
import { RolesGuard } from "../guard/role.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";


@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //get All
  @UseInterceptors(CacheInterceptor)
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

  @UseGuards(JwtAuthGuard)
  @Patch('updateProfile')
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.userService.updateUser(req.user.sub, updateUserDto);
    if(!user){
      throw new NotFoundException(`Cannot find user: ${user}`);
    }
    else{
      return user
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: number
  ) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}

