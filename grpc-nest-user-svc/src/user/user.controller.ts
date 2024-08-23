import { Body, Controller, Inject } from '@nestjs/common';
import { ClientGrpc, GrpcMethod } from "@nestjs/microservices";
import { Observable, of } from 'rxjs';
import { CreateUserRequestDto, GetUserDetailRequestDto, UpdateUserRequestDto } from './user.dto';
import { CreateUserResponse, DeleteUserRequest, GetAllUsersRequest, GetAllUsersResonse, GetUserDetailResponse, UpdateUserRequest, UpdateUserResponse, USER_SERVICE_NAME } from './user.pb';
import { UserService } from "./user.service";
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/auth/auth.pb';

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
    private async getUserDetail(data: GetUserDetailRequestDto): Promise<Observable<GetUserDetailResponse>> {
        const userData = await this.userService.getUserDetail(data);
        const response: GetUserDetailResponse = {
            user: userData.user
        }
        return of(response);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
    private async updateUser(
        @Body() data: UpdateUserRequest
    ): Promise<Observable<UpdateUserResponse>> {
        const { id, ...updateData } = data;
        const response = await this.userService.updateUser(id, updateData);
        return of(response);
    }

    @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
    private async deleteUser(
        @Body() data: DeleteUserRequest
    ): Promise<Observable<UpdateUserResponse>> {
        const response = await this.userService.deleteUser(data);
        return of(response);
    }
}
