import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from '../users/entities/user.entity';
import PostSearchService from './post-search.service';

@Injectable()
export default class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private postSearchService: PostSearchService,
  ) {}

  async getAllPosts() {
    return await this.postRepository.find({ relations: { author: true } });
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({ where: { id }, relations: { author: true } });
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async searchForPosts(text: string) {
    const results = await this.postSearchService.search(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postRepository.find({
      where: { id: In(ids) },
    });
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne({ where: { id }, relations: { author: true } });
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto, author: UserEntity) {
    const newPost = await this.postRepository.create({ ...post, author });
    await this.postRepository.save(newPost);
    this.postSearchService.indexPost(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
