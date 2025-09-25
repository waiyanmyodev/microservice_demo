export interface IPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  published: boolean;
  authorId: string;
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ICreatePost {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  tags?: string[];
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  tags?: string[];
}

export interface IPostQuery {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  authorId?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface IPostWithAuthor extends IPost {
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}