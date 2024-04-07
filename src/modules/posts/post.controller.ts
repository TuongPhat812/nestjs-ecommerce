import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import PostsService from './post.service';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { JwtAuthenticationGuard } from '../authentications/guards';
import { RequestWithUser } from '../authentications/types/request-with-user.type';

@Controller('posts')
export default class PostController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
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
