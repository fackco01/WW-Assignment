import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('roles')
export class Role {

  @PrimaryColumn()
  roleId: number;

  @Column()
  roleName: string;

  @OneToMany(() => User, (user) => user.roleId)
  users: User[]
}