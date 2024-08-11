import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  //Register User
  async register(registerData: RegisterDto) {
    const user = new User();

    const usernameInUse = await this.userRepository.findOneBy({username: registerData.username});
    if (usernameInUse) {
      throw new Error('Username already in use');
    }

    //Hash Password
    const hashPassword = await bcrypt.hash(registerData.password, 10);

    user.username = registerData.username;
    user.password = hashPassword;
    user.name = registerData.name;
    user.roleId = registerData.roleId;
    return await this.userRepository.save(user);
  }
}
