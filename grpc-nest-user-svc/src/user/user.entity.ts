import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('users')
export class User extends BaseEntity{
    @PrimaryColumn()
    public id!: number

    @Column({type: 'varchar', length: 255})
    public username!: string

    @Column({type: 'varchar', length: 255})
    public password!: string

    @Column({type: 'varchar', length: 255})
    public fullName!: string

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public createdAt!: Date

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public updatedAt!: Date

    @Column({type: 'integer'})
    public roleId!: number
}
