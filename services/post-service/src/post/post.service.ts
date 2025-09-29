import { Injectable } from '@nestjs/common';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
  PostSummaryDto,
  PaginationResult,
  PostNotFoundException,
  slugify,
  generateExcerpt,
} from '@shared/common';
import { PostRepository, PostWithAuthor } from '../repository/post.repository';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<PostResponseDto> {
    // Generate slug from title if not provided
    let slug = createPostDto.title ? slugify(createPostDto.title) : null;

    // Ensure slug is unique
    if (slug) {
      let counter = 0;
      let uniqueSlug = slug;
      while (await this.postRepository.isSlugTaken(uniqueSlug)) {
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }
      slug = uniqueSlug;
    }

    // Generate excerpt if not provided
    const excerpt = createPostDto.excerpt || generateExcerpt(createPostDto.content);

    const post = await this.postRepository.create({
      ...createPostDto,
      authorId,
      slug: slug || undefined,
      excerpt,
    });

    return this.transformToResponseDto(post);
  }

  async findAll(query: PostQueryDto): Promise<PaginationResult<PostSummaryDto>> {
    const result = await this.postRepository.findAll(query);

    return {
      ...result,
      items: result.items.map(this.transformToSummaryDto),
    };
  }

  async findById(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new PostNotFoundException();
    }
    return this.transformToResponseDto(post);
  }

  async findBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      throw new PostNotFoundException();
    }
    return this.transformToResponseDto(post);
  }

  async findByAuthor(
    authorId: string,
    query: PostQueryDto,
  ): Promise<PaginationResult<PostSummaryDto>> {
    const result = await this.postRepository.findByAuthor(authorId, query);

    return {
      ...result,
      items: result.items.map(this.transformToSummaryDto),
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new PostNotFoundException();
    }

    const updateData: any = { ...updatePostDto };

    // Update slug if title changed
    if (updatePostDto.title && updatePostDto.title !== existingPost.title) {
      const slug = slugify(updatePostDto.title);

      // Ensure slug is unique
      let counter = 0;
      let uniqueSlug = slug;
      while (await this.postRepository.isSlugTaken(uniqueSlug, id)) {
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }
      updateData.slug = uniqueSlug;
    }

    // Update excerpt if content changed
    if (updatePostDto.content && !updatePostDto.excerpt) {
      updateData.excerpt = generateExcerpt(updatePostDto.content);
    }

    const updatedPost = await this.postRepository.update(id, updateData);
    return this.transformToResponseDto(updatedPost);
  }

  async delete(id: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new PostNotFoundException();
    }

    await this.postRepository.delete(id);
  }

  async publish(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new PostNotFoundException();
    }

    const updatedPost = await this.postRepository.update(id, { published: true });
    return this.transformToResponseDto(updatedPost);
  }

  async unpublish(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new PostNotFoundException();
    }

    const updatedPost = await this.postRepository.update(id, { published: false });
    return this.transformToResponseDto(updatedPost);
  }

  async exists(id: string): Promise<boolean> {
    return this.postRepository.exists(id);
  }

  async getAuthorStats(authorId: string): Promise<{ totalPosts: number; publishedPosts: number }> {
    const [totalPosts, publishedPosts] = await Promise.all([
      this.postRepository.countByAuthor(authorId),
      this.postRepository.countPublishedByAuthor(authorId),
    ]);

    return { totalPosts, publishedPosts };
  }

  private transformToResponseDto(post: PostWithAuthor): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || undefined,
      slug: post.slug || undefined,
      published: post.published,
      authorId: post.authorId,
      // TODO: In a real implementation, fetch author data from user service
      author: {
        id: post.authorId,
        username: 'loading...',
        firstName: undefined,
        lastName: undefined,
        avatar: undefined,
      },
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt || undefined,
    };
  }

  private transformToSummaryDto(post: PostWithAuthor): PostSummaryDto {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || undefined,
      slug: post.slug || undefined,
      published: post.published,
      // TODO: In a real implementation, fetch author data from user service
      author: {
        id: post.authorId,
        username: 'loading...',
        firstName: undefined,
        lastName: undefined,
        avatar: undefined,
      },
      tags: post.tags,
      createdAt: post.createdAt,
      publishedAt: post.publishedAt || undefined,
    };
  }
}
