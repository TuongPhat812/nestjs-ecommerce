import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostEntity } from './entities/post.entity';
import { PostSearchBody } from './types';
@Injectable()
export default class PostSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: PostEntity) {
    return this.elasticsearchService.index<PostSearchBody>({
      index: this.index,
      document: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async search(text: string) {
    const result = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      query: {
        multi_match: {
          query: text,
          fields: ['title', 'content'],
        },
      },
    });
    const hits = result.hits.hits;
    return hits.map((item) => item._source);
  }
}
