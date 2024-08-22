import { plainToClass } from "@nestjs/class-transformer";
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "src/auth/auth.pb";
import { Repository } from 'typeorm';
import { CreateUserRequestDto, GetAllUsersDto, GetUserDetailDto, GetUserDetailRequestDto, UpdateUserDto, UpdateUserRequestDto, UserDto } from "./user.dto";
import { User } from "./user.entity";
import { CreateUserResponse, DeleteUserResponse, GetUserDetailResponse, UpdateUserResponse } from "./user.pb";

@Injectable()
export class UserService implements OnModuleInit {
    @Inject(AUTH_SERVICE_NAME)
    private readonly authClient: ClientGrpc;
    private authService: AuthServiceClient;

    @InjectRepository(User)
    private readonly repository: Repository<User>;
    constructor() {
    }

    onModuleInit() {
        this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    public async createUser(data: CreateUserRequestDto): Promise<CreateUserResponse> {

        const userExists = await this.repository.findOne({ where: { username: data.username } });
        if (userExists) {
            return {
                status: 409,
                error: ["User already exists"],
                id: null
            };
        }

        const user = new User();
        user.id = data.id;
        user.username = data.username;
        user.password = data.password;
        user.fullName = data.fullName;
        user.roleId = data.roleId;
        user.createdAt = new Date();
        user.updatedAt = new Date();

        try {
            const userData = await this.repository.save(user);
            const outputDto = plainToClass(UserDto, userData, {
                excludeExtraneousValues: true
            })
            return {
                status: 201,
                error: null,
                id: outputDto.id
            }
        }
        catch (error) {
            return {
                status: 500,
                error: [error.message],
                id: null
            };
        }
    }

    public async getAllUsers(): Promise<GetAllUsersDto[]> {
        const users = await this.repository.find();
        const outputDtos = plainToClass(GetAllUsersDto, users, {
        });
        return outputDtos;
    }

    public async getUserDetail(userData: GetUserDetailRequestDto): Promise<GetUserDetailResponse> {
        const user = await this.repository.findOne({ where: { id: userData.id } });
        if (!user) {
            return {
                user: null
            };
        }
        const outputDto = plainToClass(GetUserDetailDto, user, {
        })
        return {
            user: outputDto
        }
    }

    public async updateUser(id: number, data: UpdateUserRequestDto): Promise<UpdateUserResponse> {
        const userExists = await this.repository.findOne({ where: { id: id } });
        if (!userExists) {
            return {
                message: "User not found"
            };
        }
        try{
            await this.repository.update(id, data);
            //const updatedUser = await this.repository.findOne({ where: { id: id } });
            // const outputDto = plainToClass(UpdateUserDto, updatedUser, {
            //     excludeExtraneousValues: true
            // })

            //console.log(outputDto);
            
            return {
                message: "User updated successfully"
            };
        }
        catch(error){
            return {
                message: error.message
            };
        }
    }

    public async deleteUser(userData: GetUserDetailRequestDto): Promise<DeleteUserResponse> {
        const user = await this.repository.findOne({ where: { id: userData.id } });
        if (!user) {
            return {
                message: "User not found"
            };
        }
        await this.repository.delete(userData.id);
        return {
            message: "User deleted successfully"
        }
    }
}
