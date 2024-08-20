import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreatePostRequest, CreatePostResponse, DeletePostRequest, DeletePostResponse, GetAllPostsResponse, GetDetailPostRequest, GetDetailPostResponse, POST_SERVICE_NAME, PostServiceClient, UpdatePostRequest, UpdatePostResponse } from './post.pb';

@Controller('post')
export class PostController implements OnModuleInit{
    private svc: PostServiceClient;

    @Inject(POST_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit():void {
        this.svc = this.client.getService<PostServiceClient>(POST_SERVICE_NAME);
    }

    @Get()
    async getAllPosts(): Promise<Observable<GetAllPostsResponse>> {
        try{
            const response = await this.svc.getAllPosts({});
            return response;
        }
        catch(err){
            throw new HttpException('Failed to fetch posts', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    async createPost(@Body() body: CreatePostRequest): Promise<Observable<CreatePostResponse>> {
        try{
            const response = await this.svc.createPost(body);
            return response;
        }
        catch(err){
            throw new HttpException('Failed to create post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    async updatePost(
        @Param('id') id: number, 
        @Body() body: UpdatePostRequest
    ): Promise<Observable<UpdatePostResponse>> {
        try{
            body.id = id;
            const response = await this.svc.updatePost(body);
            return response;
        }
        catch(error){
            throw new HttpException('Failed to update post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async getDetailPost(
        @Param('id') id: number,
        @Body() body: GetDetailPostRequest
    ): Promise<Observable<GetDetailPostResponse>> {
        try{
            const request: GetDetailPostRequest = {id: id};
            const response = await this.svc.getDetailPost({id});
            return response;
        }
        catch(error){
            throw new HttpException('Failed to fetch post detail', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async deletePost(
        @Param('id') id: number,
        @Body() body: DeletePostRequest
    ): Promise<Observable<DeletePostResponse>> {
        try{
            body.id = id;
            const response = await this.svc.deletePost(body);
            return response;
        }
        catch(error){
            throw new HttpException('Failed to delete post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}