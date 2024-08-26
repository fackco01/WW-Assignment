import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    OnModuleInit,
    Param,
    Patch,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/config/role.decorator';
import { CreatePostRequest, CreatePostResponse, DeletePostRequest, DeletePostResponse, GetAllPostsResponse, GetDetailPostRequest, GetDetailPostResponse, POST_SERVICE_NAME, PostServiceClient, UpdatePostRequest, UpdatePostResponse } from './post.pb';
import {Public} from "../config/public.decorator";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Post')
@Controller('post')
@UseGuards(AuthGuard, RoleGuard)
@Roles(1)
@ApiBearerAuth()
export class PostController implements OnModuleInit {
    private svc: PostServiceClient;

    @Inject(POST_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<PostServiceClient>(POST_SERVICE_NAME);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Retrieve all posts' })
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getAllPosts(): Promise<Observable<GetAllPostsResponse>> {
        try {
            const response = await this.svc.getAllPosts({});
            return response;
        }
        catch (err) {
            throw new HttpException('Failed to fetch posts', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiBody({ type: CreatePostRequest })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 500, description: 'Failed to create post' })
    async createPost(
        @Body() body: CreatePostRequest
    ): Promise<Observable<CreatePostResponse>> {
        try {
            const response = await this.svc.createPost(body);
            return response;
        }
        catch (err) {
            throw new HttpException('Failed to create post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get details of a specific post' })
    @ApiResponse({ status: 200, description: 'Successful response' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async getDetailPost(
        @Param('id') id: number,
        @Body() body: GetDetailPostRequest,
    ): Promise<Observable<GetDetailPostResponse>> {
        try {
            const postId = id;

            const request: GetDetailPostRequest = { id: postId };
            const response = await this.svc.getDetailPost(request);
            return response;
        }
        catch (error) {
            const query = `[NestJS] fix error: ${error.message}`
            window.open(`https://chatgpt.com/?q=${encodeURIComponent(query)}`)
        }
    }

    //Update Post
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a post' })
    @ApiBody({ type: UpdatePostRequest })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    @ApiResponse({ status: 500, description: 'Failed to update post' })
    async updatePost(
        @Param('id') id: number,
        @Body() body: Omit<UpdatePostRequest, 'id'>
    ): Promise<Observable<UpdatePostResponse>> {
        try {
            const postId = id;
            const request: UpdatePostRequest = {id: postId, ...body};
            const response = await this.svc.updatePost(request);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to update post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Delete Post
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a post' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    @ApiResponse({ status: 500, description: 'Failed to delete post' })
    async deletePost(
        @Param('id') id: number
    ): Promise<Observable<DeletePostResponse>> {
        try {
            const postId = id;
            const request: DeletePostRequest = {id: postId};
            const response = await this.svc.deletePost(request);
            return response;
        }
        catch (error) {
            throw new HttpException('Failed to delete post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
