import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from "@nestjs/common";
import { AuthService } from './auth.service';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  //POST: Login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginData: LoginDto
  ) : Promise<{token: string}> {
    return await this.authService.login(loginData);
  }

  //Post: Register
  @Post('register')
  async register(
    @Body() registerData: RegisterDto) {
    return await this.authService.register(registerData);
  }

  //POST: Refresh Token
}
