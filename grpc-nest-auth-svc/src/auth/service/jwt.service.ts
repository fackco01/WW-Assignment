import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {Auth} from "../auth.entity";
import { JwtService as Jwt } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class JwtService {
    constructor(
        private readonly jwt: Jwt,
        @InjectRepository(Auth)
        private readonly repository: Repository<Auth>)
    {}

    //Decode token
    public async decode(token: string): Promise<Auth> {
        return this.jwt.decode(token, null);
    }

    //Generate token
    public async generateToken(auth: Auth): Promise<string> {
        return this.jwt.sign({
            id: auth.id,
            username: auth.username,
            name : auth.name,
            roleId: auth.roleId});
    }

    //validate user
    public async validateUser(decoded: any): Promise<Auth> {
        try {
            return await this.repository.findOneBy({id: decoded.id});
        }
        catch (e) {
            throw new Error("User not found");
        }
    }

    //verify token
    public async verifyToken(token: string): Promise<Auth> {
        try{
            return await this.jwt.verify(token);
        }
        catch (e) {
            throw new Error("Invalid token");
        }
    }

    //validate user password
    public async isPasswordValid(password: string, userPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, userPassword);
        }
        catch (e) {
            throw new Error("password is invalid");
        }
    }

    //hash password
    public async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        }
        catch (e) {
            throw e.message("password is invalid");
        }
    }

}
