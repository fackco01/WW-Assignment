import { Body, Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from "@nestjs/microservices";
import { Observable, of } from "rxjs";
import { LoginRequestDto, RegisterRequestDto, ValidateRequestDto } from "./auth.dto";
import { AUTH_SERVICE_NAME, DeleteRequest, DeleteResponse, LoginResponse, RegisterResponse, ValidateResponse } from "./auth.pb";
import { AuthService } from "./service/auth.service";

@Controller()
export class AuthController {
    @Inject(AuthService)
    private readonly service: AuthService;

    @GrpcMethod(AUTH_SERVICE_NAME, 'Register')
    private async register(
        @Body() payload: RegisterRequestDto)
        : Promise<Observable<RegisterResponse>> {
        return of(await this.service.register(payload));
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
    private async login(
        @Body() payload: LoginRequestDto)
        : Promise<Observable<LoginResponse>> {
        return of(await this.service.login(payload));
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
    private async validate(
        @Body() payload: ValidateRequestDto)
        : Promise<Observable<ValidateResponse>> {
        return of(await this.service.validateToken(payload));
    }

    @GrpcMethod(AUTH_SERVICE_NAME, 'Delete')
    @GrpcMethod(AUTH_SERVICE_NAME, 'Delete')
    @GrpcMethod(AUTH_SERVICE_NAME, 'Delete')
    private async delete(
        @Body() payload: DeleteRequest)
        : Promise<Observable<DeleteResponse>> {
        const response = await this.service.deleteAuth(payload);
        return of(response);
    }
}
