/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostEntity } from './entities/post.entity';
import { PostCountResult, PostSearchBody, PostSearchResult } from './types';
@Injectable()
export default class PostSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: PostEntity) {
    return this.elasticsearchService.index<PostSearchResult, PostSearchBody>(
      {
        index: this.index,
        body: {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.author.id,
        },
      },
      {},
    );
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    try {
      let separateCount = 0;
      if (startId) {
        separateCount = await this.count(text, ['title', 'content']);
      }

      const { body } = await this.elasticsearchService.search<PostSearchResult>({
        index: this.index,
        from: offset,
        size: limit,
        body: {
          query: {
            bool: {
              should: {
                multi_match: {
                  query: text,
                  fields: ['title', 'content'],
                },
              },
              filter: {
                range: {
                  id: {
                    gt: startId,
                  },
                },
              },
              minimum_should_match: 1,
            },
          },
          sort: {
            id: {
              order: 'asc',
            },
          },
        },
      });
      const count = body.hits.total.value;
      const hits = body.hits.hits;
      const returnData = {
        count,
        results: hits.map((item) => item._source),
      };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async count(query: string, fields: string[]) {
    const { body } = await this.elasticsearchService.count<PostCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return body.count;
  }
}
