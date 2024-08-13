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
  // @Get(':id')
  // async findUserId(
  //   @Param('id') id: number,
  // ): Promise<GetUserDto> {
  //   try{
  //     const user: User = await this.userService.findUserById(id);
  //     const dto = new GetUserDto();
  //     dto.userId = user.userId;
  //     dto.username = user.username;
  //     dto.name = user.name;
  //     dto.password = user.password;
  //     dto.roleId = user.roleId;
  //     return dto;
  //   }
  //   catch (error) {
  //     throw new NotFoundException(`Cannot find user: ${error}`);
  //   }
  // }

//Get profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async findUserId(
    @Res() res,
    @Req() req
  ) {
    try {
      const user: User = await this.userService.findUserById(req.user.sub);

      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'User not found',
        });
      }

      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw new NotFoundException(`Cannot find user: ${error.message}`);
    }
  }


}

