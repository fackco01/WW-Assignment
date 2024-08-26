import {HttpException, HttpStatus, Injectable, OnModuleInit} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import {CreatePostRequestDto, GetAllPostsDto, GetDetailPostRequestDto, PostDto, UpdatePostRequestDto} from './post.dto';
import {
    CreatePostResponse,
    DeletePostRequest,
    DeletePostResponse,
    GetDetailPostResponse,
    UpdatePostResponse
} from './post.pb';

@Injectable()
export class PostService implements OnModuleInit {
    @InjectRepository(Post)
    private readonly repository: Repository<Post>;

    constructor() {
    }

    onModuleInit() {
    }

    public async createPost(data: CreatePostRequestDto): Promise<CreatePostResponse> {

        const post = new Post();
        post.title = data.title;
        post.content = data.content;
        post.author = data.author;
        post.createdAt = new Date();
        post.updatedAt = new Date();

        try {
            const postData = await this.repository.save(post);
            const outputDto = plainToClass(PostDto, postData, {
                excludeExtraneousValues: true
            });
            return {
                id: outputDto.id,
                message: 'Post created successfully',
                createdAt: outputDto.createdAt,
                status: 201
            }
        } catch (error) {
            return {
                id: null,
                message: error.message,
                createdAt: null,
                status: 500
            }
        }
    }

    //Get All Posts
    public async getAllPosts(): Promise<GetAllPostsDto[]> {
        const posts = await this.repository.find();
        const outputDtos = plainToInstance(GetAllPostsDto, posts, {
            excludeExtraneousValues: true
        });
        return outputDtos;
    }

    //Get Post Detail
    public async getPostDetail(postData: GetDetailPostRequestDto): Promise<GetDetailPostResponse> {
        const postExist = await this.repository.findOneBy({id: postData.id});
        if (!postExist) {
            return {
                post: null,
            }
        }

        try {
            const outputDto = plainToClass(PostDto, postExist, {});

            return {
                post: outputDto
            }
        } catch (error) {
            throw new HttpException('Failed to create post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Update Post
    public async updatePost(id: number, data: UpdatePostRequestDto): Promise<UpdatePostResponse> {
        const postExist = await this.repository.findOneBy({id: id});
        if (!postExist) {
            return {
                message: "Post not found"
            }
        }

        try {
            if (Object.keys(data).length === 0) {
                return {
                    message: "No update data provided"
                };
            }

            await this.repository.save({
                id: id,
                ...data
            });
            return {
                message: "Post updated successfully"
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    //Delete Post
    public async deletePost(data: GetDetailPostRequestDto): Promise<DeletePostResponse> {
        const postExist = await this.repository.findOneBy({id: data.id});
        if (!postExist) {
            return {
                message: "Post not found"
            }
        }
        try {
            const deleteRequest : DeletePostRequest = {id: data.id};
            await this.repository.delete(deleteRequest);
            return {
                message: "Post deleted successfully"
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
