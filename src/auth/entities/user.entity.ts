import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";


@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  userId: number;

  @Column({unique: true})
  username: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  roleId: number;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}