import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('posts')
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number

    @Column({type: 'varchar', length: 255})
    public title!: string

    @Column({type: 'text'})
    public content!: string

    @Column({type: 'varchar', length: 255})
    public author!: string

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public createdAt!: Date

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    public updatedAt!: Date
}
