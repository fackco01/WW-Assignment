import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { IsString } from "class-validator";


@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  userId: number;

  @IsString()
  @Column({unique: true})
  username: string;

  @IsString()
  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  roleId: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}