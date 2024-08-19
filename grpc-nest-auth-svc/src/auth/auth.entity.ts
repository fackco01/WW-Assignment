import { Exclude } from 'class-transformer';
import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Role} from "./role.entity";

@Entity('auths')
export class Auth extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar' })
    public username!: string;

    @Exclude()
    @Column({ type: 'varchar' })
    public password!: string;

    @Column({ type: 'varchar' })
    public name!: string;

    @Column({ type: 'integer' })
    public roleId!: number;

    @ManyToOne(() => Role, role => role.auths)
    @JoinColumn({ name: 'roleId' })
    public role!: Role;
}
