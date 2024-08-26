import { Body, Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { CreatePostRequestDto } from './post.dto';
import {
    CreatePostResponse, DeletePostRequest, DeletePostResponse,
    GetAllPostsRequest,
    GetAllPostsResponse,
    GetDetailPostRequest,
    GetDetailPostResponse,
    POST_SERVICE_NAME,
    UpdatePostRequest, UpdatePostResponse
} from './post.pb';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    @Inject(PostService)
    private readonly postService: PostService;

    @GrpcMethod(POST_SERVICE_NAME, 'CreatePost')
    private async createPost(
        @Body() data: CreatePostRequestDto
    ): Promise<Observable<CreatePostResponse>> {
        const response = await this.postService.createPost(data);
        return of(response);
    }

    @GrpcMethod(POST_SERVICE_NAME, 'GetAllPosts')
    private async getAllPosts(
        data: GetAllPostsRequest
    ): Promise<Observable<GetAllPostsResponse>> {
        {
            const response = {
                post: await this.postService.getAllPosts(),
            };
            return of(response);
        }
    }

    @GrpcMethod(POST_SERVICE_NAME, 'GetDetailPost')
    private async getPostDetail(
        data: GetDetailPostRequest
    ): Promise<Observable<GetDetailPostResponse>> {
        const postData = await this.postService.getPostDetail(data);
        const response = {
            post: postData.post,
        }

        return of(response);
    }

    @GrpcMethod(POST_SERVICE_NAME, 'UpdatePost')
    private async updatePost(
        @Body() data: UpdatePostRequest
    ) : Promise<Observable<UpdatePostResponse>> {
        try {
            const { id, ...updateData } = data;
            const response = await this.postService.updatePost(id, updateData);
            return of(response);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    @GrpcMethod(POST_SERVICE_NAME, 'DeletePost')
    private async deletePost(
        @Body() data: DeletePostRequest
    ): Promise<Observable<DeletePostResponse>> {
        try {
            const response = await this.postService.deletePost(data);
            return of(response);
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
