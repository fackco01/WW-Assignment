import {HttpStatus, Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Auth} from "../auth.entity";
import { Repository } from "typeorm";
import {JwtService} from "./jwt.service";
import {RegisterRequestDto} from "../auth.dto";
import {LoginRequest, LoginResponse, RegisterResponse, ValidateRequest, ValidateResponse} from "../auth.pb";

@Injectable()
export class AuthService{
    @InjectRepository(Auth)
    private readonly repository: Repository<Auth>;

    @Inject(JwtService)
    private readonly jwtService: JwtService;

    public async register(registerData : RegisterRequestDto) : Promise<RegisterResponse> {
        let auth: Auth = await this.repository.findOneBy({username: registerData.username});

        if (auth) {
            throw new Error("User already exists");
        }

        auth = new Auth();
        auth.username = registerData.username;
        auth.password = await this.jwtService.hashPassword(registerData.password);
        auth.name = registerData.name;
        auth.roleId = registerData.roleId;

        await this.repository.save(auth);

        return {
            status: HttpStatus.CREATED,
            error: ['User already exists']
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
