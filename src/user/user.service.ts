import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });

    if(!user) {
      throw new NotFoundException(`Cannot find user with id: ${id}`);
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username: username });
    if(!user) {
      throw new NotFoundException(`Cannot find user with username: ${username}`);
    }
    return user;
  }
}
