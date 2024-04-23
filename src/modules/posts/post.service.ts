/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan, FindOptionsWhere } from 'typeorm';
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

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindOptionsWhere<PostEntity> = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postRepository.count();
    }

    const [items, count] = await this.postRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
      cache: {
        id: 'all_posts',
        milliseconds: 10000,
      },
    });

    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({ where: { id }, relations: { author: true } });
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async searchForPosts(text: string, offset?: number, limit?: number, startId?: number) {
    const { results, count } = await this.postSearchService.search(text, offset, limit, startId);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return {
        items: [],
        count,
      };
    }
    const items = await this.postRepository.find({
      where: { id: In(ids) },
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      cache: {
        id: `search_posts_${text}`,
        milliseconds: 10000,
      },
    });
    return {
      items,
      count,
    };
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
    await this.postSearchService.indexPost(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postSearchService.remove(id);
  }
}
