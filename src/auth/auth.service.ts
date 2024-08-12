import { Body, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {
  }

  //Register User
  async register(registerData: RegisterDto) {
    const user = new User();

    const usernameInUse = await this.userRepository.findOneBy({ username: registerData.username });
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

  //Login
  async login(loginData: LoginDto) {
    const { username, password } = loginData;
    const user = await this.userRepository.findOneBy({ username: loginData.username });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await bcrypt.compare(loginData.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Password not match');
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      name: user.name,
      roleId: user.roleId
    };

    return {
      token: this.jwtService.sign(payload)
    }
  }
}
