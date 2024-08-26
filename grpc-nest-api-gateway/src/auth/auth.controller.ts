import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AUTH_SERVICE_NAME, AuthServiceClient, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth.pb';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserRequest} from "../user/user.pb";

@ApiTags('auth')
@Controller('auth')
export class AuthController implements OnModuleInit {
    private svc: AuthServiceClient;

    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register' })
    @ApiBody({ type: RegisterRequest })
    @ApiResponse({ status: 201, description: 'Register successfully'})
    @ApiResponse({ status: 500, description: 'Failed to register' })
    async register(@Body() body: RegisterRequest): Promise<Observable<RegisterResponse>> {
        return this.svc.register(body);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginRequest })
    @ApiResponse({ status: 201, description: 'Login successfully'})
    @ApiResponse({ status: 500, description: 'Failed to login' })
    async login(@Body() body: LoginRequest): Promise<Observable<LoginResponse>> {
        return this.svc.login(body);
    }
}
