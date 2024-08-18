import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginRequest, RegisterRequest, ValidateRequest } from './auth.pb';

export class LoginRequestDto implements LoginRequest {
    @IsString()
    public readonly username: string;

    @IsString()
    public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
    @IsEmail()
    public readonly username: string;

    @IsString()
    @MinLength(8)
    public readonly password: string;
}

export class ValidateRequestDto implements ValidateRequest {
    @IsString()
    public readonly token: string;
}
