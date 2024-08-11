import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  //POST: Login

  //Post: Register
  @Post('register')
  async register(
    @Body() registerData: RegisterDto) {
    return await this.authService.register(registerData);
  }

  //POST: Refresh Token
}
