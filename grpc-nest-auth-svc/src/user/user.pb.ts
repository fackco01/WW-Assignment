// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.2
//   protoc               v5.27.3
// source: user.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface User {
  id: number;
  username: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  roleId: number;
}

/** CreateUser */
export interface CreateUserRequest {
  id: number;
  username: string;
  password: string;
  fullName: string;
  roleId: number;
}

export interface CreateUserResponse {
  status: number;
  error: string[];
  id: number;
}

/** UpdateUser */
export interface UpdateUserRequest {
  id: number;
  fullName: string;
  updatedAt: string;
}

export interface UpdateUserResponse {
  message: string;
}

/** GetAllUsers */
export interface GetAllUsersRequest {
}

export interface GetAllUsersResonse {
  users: User[];
}

/** GetUserDetail */
export interface GetUserDetailRequest {
  id: number;
}

export interface GetUserDetailResponse {
  user: User | undefined;
}

/** DeleteUser */
export interface DeleteUserRequest {
  id: number;
}

export interface DeleteUserResponse {
  message: string;
}

/** ChangePassword */
export interface ChangePasswordRequest {
  id: number;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  updateUser(request: UpdateUserRequest): Observable<UpdateUserResponse>;

  getAllUsers(request: GetAllUsersRequest): Observable<GetAllUsersResonse>;

  getUserDetail(request: GetUserDetailRequest): Observable<GetUserDetailResponse>;

  deleteUser(request: DeleteUserRequest): Observable<DeleteUserResponse>;

  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;

  updateUser(
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> | Observable<UpdateUserResponse> | UpdateUserResponse;

  getAllUsers(
    request: GetAllUsersRequest,
  ): Promise<GetAllUsersResonse> | Observable<GetAllUsersResonse> | GetAllUsersResonse;

  getUserDetail(
    request: GetUserDetailRequest,
  ): Promise<GetUserDetailResponse> | Observable<GetUserDetailResponse> | GetUserDetailResponse;

  deleteUser(
    request: DeleteUserRequest,
  ): Promise<DeleteUserResponse> | Observable<DeleteUserResponse> | DeleteUserResponse;

  changePassword(
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> | Observable<ChangePasswordResponse> | ChangePasswordResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "updateUser",
      "getAllUsers",
      "getUserDetail",
      "deleteUser",
      "changePassword",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
