import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>{
    //Find id
    const user = await this.userRepository.findOneBy({userId: id});
    if(!user) {
      throw new NotFoundException(`Cannot find user with id: ${id}`);
    }

    // Update fields if they exist in DTO
    const updatedFields: Partial<User> = {};
    if (updateUserDto.name) updatedFields.name = updateUserDto.name;
    if (updateUserDto.username) updatedFields.username = updateUserDto.username;
    if (updateUserDto.roleId) updatedFields.roleId = updateUserDto.roleId;
    if (updateUserDto.password) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
      updatedFields.password = hashPassword;
    }
    Object.assign(user, updatedFields);

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({userId: id});
    if(!user) {
      throw new NotFoundException(`Cannot find user with id: ${id}`);
    }
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Failed to delete user with ID ${id}`);
    }
  }
}
