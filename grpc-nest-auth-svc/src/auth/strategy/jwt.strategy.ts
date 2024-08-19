import {Inject, Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {jwtConstants} from "../constants/constants";
import {Auth} from "../auth.entity";
import {JwtService} from "../service/jwt.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    @Inject(JwtService)
    private readonly jwtService: JwtService;
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    private validate(token: string) : Promise<Auth | null> {
        return this.jwtService.validateUser(token);
    }
}
