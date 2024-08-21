import { HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { USER_SERVICE_NAME, UserServiceClient } from "src/user/user.pb";
import { Repository } from "typeorm";
import { RegisterRequestDto } from "../auth.dto";
import { Auth } from "../auth.entity";
import { LoginRequest, LoginResponse, RegisterResponse, ValidateRequest, ValidateResponse } from "../auth.pb";
import { JwtService } from "./jwt.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService implements OnModuleInit{
    @Inject(USER_SERVICE_NAME)
    private readonly userClient: ClientGrpc;
    private userService: UserServiceClient;
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>;

    @Inject(JwtService)
    private readonly jwtService: JwtService;

    onModuleInit() {
        this.userService = this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
    }

    public async register(registerData : RegisterRequestDto) : Promise<RegisterResponse> {
        let auth: Auth = await this.repository.findOneBy({username: registerData.username});

        if (auth) {
            return {
                status: HttpStatus.CONFLICT,
                error: ['User already exists'],
                id: null
            };
        }

        auth = new Auth();
        auth.username = registerData.username;
        auth.password = await this.jwtService.hashPassword(registerData.password);
        auth.name = registerData.name;
        auth.roleId = registerData.roleId;

        await this.repository.save(auth);

        const createUserResponse = await firstValueFrom(this.userService.createUser({
            id: auth.id,
            username: auth.username,
            password: auth.password,
            fullName: auth.name,
            roleId: auth.roleId,
        }));

        if (createUserResponse.status !== 201) {
            await this.repository.remove(auth);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: createUserResponse.error,
                id: null
            };
        }

        return {
            status: HttpStatus.CREATED,
            error: ['User already exists'],
            id: auth.id
        }
    }

    public async login(loginData : LoginRequest) : Promise<LoginResponse> {
        let auth: Auth = await this.repository.findOneBy({username: loginData.username});

        if (!auth) {
            throw new Error("User not found");
        }

        const isPasswordValid: boolean = await this.jwtService.isPasswordValid(loginData.password, auth.password);
        if (!isPasswordValid) {
            return {
                status: HttpStatus.NOT_FOUND,
                error: ['Password wrong'],
                token: null };
        }

        const payload: string = await this.jwtService.generateToken(auth);
        return {
            status: HttpStatus.OK,
            error: null,
            token: payload
        }
    }

    public async validateToken(token: ValidateRequest): Promise<ValidateResponse> {
        const decoded : Auth = await this.jwtService.verifyToken(token.token);

        if(!decoded) {
            return {
                status: HttpStatus.FORBIDDEN,
                error: ['Invalid token'],
                userId: null
            }
        }

        const auth: Auth = await this.jwtService.validateUser(decoded);

        if (!auth) {
            return {
                status: HttpStatus.FORBIDDEN,
                error: ['User not found'],
                userId: null
            }
        }

        return {
            status: HttpStatus.OK,
            error: null,
            userId: decoded.id
        }
    }
}
