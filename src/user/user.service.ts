import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Repository } from "typeorm";
import { GetUserDto } from "./dto/get-all-user.dto";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username: username });
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ userId: id });
  }
}
