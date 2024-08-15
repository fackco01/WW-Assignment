import { Body, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { AccessTokenStrategy } from "../guard/jwt-guard.strategy";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { NewUserEvent } from "../events/new-user.event";


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly tokenStrategy: AccessTokenStrategy,
    private readonly eventEmitter: EventEmitter2
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
    const userData = await this.userRepository.save(user);

    //Event Emitter
    this.eventEmitter.emit(
      'user.registered',
      new NewUserEvent(
        userData.username,
        userData.name,
        userData.roleId
        ));

    return userData;
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

    const payload = this.tokenStrategy.validate({
      username: user.username,
      sub: user.userId,
      roleId: user.roleId });

    return {
      token: this.jwtService.sign(payload, {
        secret: 'deb1ccd5c313ff224118dee9b4dae9203d68213f3a5533c77a9ae71d85fdcd2f',
        privateKey: 'deb1ccd5c313ff224118dee9b4dae9203d68213f3a5533c77a9ae71d85fdcd2f',
      }),

      message: `Welcome Back User: ${user.username}`,
    }
  }
}
