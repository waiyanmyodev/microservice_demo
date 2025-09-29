import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Post } from '../../node_modules/.prisma/post-client';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PaginationResult,
  calculatePagination,
  createPaginationResult,
} from '@shared/common';

// In microservices, we don't join author data at database level
// Author data will be fetched separately from user service
export type PostWithAuthor = Post;

@Injectable()
export class PostRepository implements OnModuleInit, OnModuleDestroy {
  private prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  async create(
    createPostDto: CreatePostDto & { authorId: string; slug?: string },
  ): Promise<PostWithAuthor> {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        publishedAt: createPostDto.published ? new Date() : null,
      },
    });
  }

  async findAll(query: PostQueryDto): Promise<PaginationResult<PostWithAuthor>> {
    const {
      page = 1,
      limit = 10,
      search,
      published,
      authorId,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where clause
    const where: any = {};

    if (published !== undefined) {
      where.published = published;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Get total count
    const total = await this.prisma.post.count({ where });

    // Calculate pagination
    const { skip, take } = calculatePagination(total, page, limit);

    // Get posts
    const posts = await this.prisma.post.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    });

    return createPaginationResult(posts, total, page, limit);
  }

  async findById(id: string): Promise<PostWithAuthor | null> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<PostWithAuthor | null> {
    return this.prisma.post.findUnique({
      where: { slug },
    });
  }

  async findByAuthor(
    authorId: string,
    query: PostQueryDto,
  ): Promise<PaginationResult<PostWithAuthor>> {
    return this.findAll({ ...query, authorId });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostWithAuthor> {
    const updateData: any = { ...updatePostDto };

    // Update publishedAt if published status changes
    if (updatePostDto.published !== undefined) {
      updateData.publishedAt = updatePostDto.published ? new Date() : null;
    }

    return this.prisma.post.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!post;
  }

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const where: any = { slug };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }
    const post = await this.prisma.post.findUnique({
      where,
      select: { id: true },
    });
    return !!post;
  }

  async countByAuthor(authorId: string): Promise<number> {
    return this.prisma.post.count({
      where: { authorId },
    });
  }

  async countPublishedByAuthor(authorId: string): Promise<number> {
    return this.prisma.post.count({
      where: { authorId, published: true },
    });
  }
}
