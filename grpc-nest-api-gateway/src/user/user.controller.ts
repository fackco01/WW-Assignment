import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    OnModuleInit,
    Param,
    Patch,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ChangePasswordRequest, ChangePasswordResponse, CreateUserRequest, CreateUserResponse, DeleteUserRequest, DeleteUserResponse, GetAllUsersRequest, GetAllUsersResonse, GetUserDetailRequest, GetUserDetailResponse, UpdateUserRequest, UpdateUserResponse, USER_SERVICE_NAME, UserServiceClient } from './user.pb';
import {AuthGuard} from "../auth/auth.guard";

@Controller('user')
export class UserController implements OnModuleInit {
    private svc: UserServiceClient;

    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService(USER_SERVICE_NAME);
    }

    @Post()
    async createUser(@Body() createUserRequest: CreateUserRequest): Promise<Observable<CreateUserResponse>> {
        try {
            const response = await this.svc.createUser(createUserRequest);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/update')
    @UseGuards(AuthGuard)
    async updateUser(
        @Req() req,
        @Body() updateUserRequest: Omit<UpdateUserRequest, 'id'>
    ): Promise<Observable<UpdateUserResponse>> {
        try {
            const userId = req.user.id;
            const fullRequest: UpdateUserRequest = {
                id: userId,
                ...updateUserRequest
            };

            const response = await this.svc.updateUser(fullRequest);
            
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async getAllUsers(@Req () request: GetAllUsersRequest): Promise<Observable<GetAllUsersResonse>> {
      try {
        const response = await this.svc.getAllUsers(request);
        return response;
      } catch (error) {
        throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    async getUserDetail(
        @Req () req
    ): Promise<Observable<GetUserDetailResponse>> {
        try {
            const userId = req.user.id;

            const request: GetUserDetailRequest = {id: userId};
            const response = await this.svc.getUserDetail(request);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to fetch user detail', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<Observable<DeleteUserResponse>> {
        try{
            const request: DeleteUserRequest = {id: id};
            const response = await this.svc.deleteUser(request);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id/changePassword')
    async changePassword(
        @Param('id') id: number,
        @Body() changePasswordRequest: ChangePasswordRequest
    ): Promise<Observable<ChangePasswordResponse>> {
        try {
            const request : ChangePasswordRequest = {id, ...changePasswordRequest};
            const response = await this.svc.changePassword(request);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to change password', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
