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
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController implements OnModuleInit {
    private svc: UserServiceClient;

    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService(USER_SERVICE_NAME);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserRequest })
    @ApiResponse({ status: 201, description: 'User created successfully'})
    @ApiResponse({ status: 500, description: 'Failed to create user' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user information' })
    @ApiBody({ type: UpdateUserRequest, description: 'User data to update' })
    @ApiResponse({ status: 200, description: 'User updated successfully'})
    @ApiResponse({ status: 500, description: 'Failed to update user' })
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
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Retrieved all users successfully'})
    @ApiResponse({ status: 500, description: 'Failed to fetch users' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'Retrieved user profile successfully'})
    @ApiResponse({ status: 500, description: 'Failed to fetch user detail' })
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

    @Delete('/delete')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user account' })
    @ApiResponse({ status: 200, description: 'User deleted successfully'})
    @ApiResponse({ status: 500, description: 'Failed to delete user' })
    async deleteUser(
        @Req() req,
    ): Promise<Observable<DeleteUserResponse>> {
        try{
            const userId = req.user.id;

            const request: DeleteUserRequest = {id: userId};
            const response = await this.svc.deleteUser(request);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @Patch(':id/changePassword')
    // async changePassword(
    //     @Param('id') id: number,
    //     @Body() changePasswordRequest: ChangePasswordRequest
    // ): Promise<Observable<ChangePasswordResponse>> {
    //     try {
    //         const request : ChangePasswordRequest = {id, ...changePasswordRequest};
    //         const response = await this.svc.changePassword(request);
    //         return response;
    //     }
    //     catch (error) {
    //         throw new HttpException('Failed to change password', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}
