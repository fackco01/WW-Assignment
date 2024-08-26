import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { CreatePostRequest, GetDetailPostRequest, UpdatePostRequest } from "./post.pb";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostRequestDto implements CreatePostRequest {
    @IsNotEmpty()
    @ApiProperty()
    public readonly title: string;
    @IsNotEmpty()
    @ApiProperty()
    public readonly content: string;
    @IsNotEmpty()
    @ApiProperty()
    public readonly author: string;
    @ApiProperty()
    public readonly createAt: string;
    @ApiProperty()
    public readonly updateAt: string;
}

export class UpdatePostRequestDto implements Partial<Omit<UpdatePostRequest, 'id'>> {
    @IsOptional()
    @ApiProperty()
    title?: string;
    @IsOptional()
    @ApiProperty()
    content?: string;
}

export class GetDetailPostRequestDto implements GetDetailPostRequest{
    @IsNotEmpty()
    public readonly id: number;
}

export class PostDto{
    @Exclude()
    public readonly id: number;
    @Expose()
    public readonly title: string;
    @Expose()
    public readonly content: string;
    @Expose()
    public readonly author: string;
    @Expose()
    public readonly createdAt: string;
    @Expose()
    public readonly updatedAt: string;

    constructor(partial: Partial<PostDto>) {
        Object.assign(this, partial);
    }
}

export class GetAllPostsDto{
    @Exclude()
    public readonly id: number;
    @Expose()
    public readonly title: string;
    @Expose()
    public readonly content: string;
    @Expose()
    public readonly author: string;
    @Expose()
    public readonly createdAt: string;
    @Expose()
    public readonly updatedAt: string;
}

