import { Body, Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from "@nestjs/microservices";
import { Observable, of } from 'rxjs';
import { CreateUserRequestDto } from './user.dto';
import { CreateUserResponse, GetAllUsersRequest, GetAllUsersResonse, GetUserDetailRequest, GetUserDetailResponse, USER_SERVICE_NAME } from './user.pb';
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    @Inject(UserService)
    private readonly userService: UserService

    @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
    private async createUser(
        @Body() data: CreateUserRequestDto
    ): Promise<Observable<CreateUserResponse>> {
        return of(await this.userService.createUser(data));
    }

    @GrpcMethod(USER_SERVICE_NAME, 'GetAllUsers')
    private async getAllUsers(data: GetAllUsersRequest): Promise<Observable<GetAllUsersResonse>> {
        const users = await this.userService.getAllUsers();
        const response: GetAllUsersResonse = {
            users: users
        };
        return of(response);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'GetUserDetail')
    private async getUserDetail(data: GetUserDetailRequest): Promise<Observable<GetUserDetailResponse>> {
        const userData = await this.userService.getUserDetail(data);
        const response: GetUserDetailResponse = {
            user: userData.user
        }

        return of(response);
    }
}
