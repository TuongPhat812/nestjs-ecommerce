import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostController from './post.controller';
import PostService from './post.service';
import { PostEntity } from './entities/post.entity';
import PostSearchService from './post-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), SearchModule],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export class PostModule {}
