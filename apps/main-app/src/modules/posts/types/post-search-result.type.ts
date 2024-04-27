import { PostSearchBody } from './post-search-body.type';

interface PostSearchResult {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

export { PostSearchResult };
