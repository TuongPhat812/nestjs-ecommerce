import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import PostsService from './post.service';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { JwtAccessTokenAuthenticationGuard } from '../authentications/guards';
import { RequestWithUser } from '../authentications/types/request-with-user.type';
import { PaginationParams } from './types/pagination-params.type';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query('search') search: string, @Query() { offset, limit, startId }: PaginationParams) {
    if (search) {
      return this.postsService.searchForPosts(search, offset, limit, startId);
    }
    return this.postsService.getAllPosts(offset, limit, startId);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAccessTokenAuthenticationGuard)
  async createPost(@Req() request: RequestWithUser, @Body() post: CreatePostDto) {
    return this.postsService.createPost(post, request.user);
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost(Number(id));
  }
}
