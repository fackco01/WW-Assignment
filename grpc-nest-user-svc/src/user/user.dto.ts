
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import {
    CreateUserRequest,
    GetUserDetailRequest,
    UpdateUserRequest
} from "./user.pb";

export class CreateUserRequestDto implements CreateUserRequest {

    @IsNotEmpty()
    public readonly id: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;

    @IsNotEmpty()
    @IsString()
    public readonly password: string;

    @IsString()
    public readonly fullName: string;

    @IsNotEmpty()
    public readonly roleId: number;
}

export class UpdateUserRequestDto implements UpdateUserRequest {

    @IsNotEmpty()
    public readonly id: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;

    @IsString()
    public readonly fullName: string;
}

export class GetUserDetailRequestDto implements GetUserDetailRequest {
    @IsNotEmpty()
    public readonly id: number;
}

// export class ChangePasswordRequestDto implements ChangePasswordRequest{
//
//     @IsNotEmpty()
//     public readonly userId: number;
//
//     @IsNotEmpty()
//     public readonly currentPassword: string;
//
//     @IsNotEmpty()
//     public readonly newPassword: string;
// }

export class UserDto {
    @Exclude()
    public readonly id: number;
    @Expose()
    public readonly username: string;
    @Exclude()
    public readonly password: string;
    @Expose()
    public readonly fullName: string;
    @Expose()
    public readonly createdAt: string;
    @Expose()
    public readonly updatedAt: string;
    @Expose()
    public readonly roleId: number;

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}

export class GetUserDetailDto {
    @Expose()
    public id: number;
    @Expose()
    public readonly username: string;
    @Exclude()
    public readonly password: string;
    @Expose()
    public readonly fullName: string;
    @Expose()
    public readonly createdAt: string;
    @Expose()
    public readonly updatedAt: string;
    @Expose()
    public readonly roleId: number;
}

export class GetAllUsersDto {
    @Expose()
    public id: number;
    @Expose()
    public readonly username: string;
    @Exclude()
    public readonly password: string;
    @Expose()
    public readonly fullName: string;
    @Expose()
    public readonly createdAt: string;
    @Expose()
    public readonly updatedAt: string;
    @Expose()
    public readonly roleId: number;
}
