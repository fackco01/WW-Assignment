import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Cache } from "cache-manager";
import * as bcrypt from "bcrypt";
import { Role } from "../auth/entities/role.entity";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @Inject('CACHE_MANAGER') private cacheManager: Cache
  ) {}

  async findAllUser(): Promise<User[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.userRepository.find());
      }, 1000);
    })
    //return await this.userRepository.find();
  }

  async findAllRole(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async getRoleNameById(roleId: number): Promise<string> {
    const role = await this.roleRepository.findOne({ where: { roleId } });
    return role ? role.roleName : null;
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

  //Caching
  async getCacheUser(): Promise<any>{
    // const cacheData =  await this.cacheManager.get('users');
    // if(cacheData){
    //   console.log('Data cache');
    //   return cacheData;
    // }
    // if have Cache Interceptor, don't need this const
    const userData = await this.findAllUser();
    await this.cacheManager.set('users', userData);
    console.log('Data not cache');
    return userData;
  }
}
