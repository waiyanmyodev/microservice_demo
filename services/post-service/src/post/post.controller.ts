import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  ResponseDto,
  MessagePatterns,
  SUCCESS_MESSAGES,
  HealthCheckDto,
} from '@shared/common';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @MessagePattern({ cmd: MessagePatterns.POST_CREATE })
  async create(@Payload() data: { createPostDto: CreatePostDto; authorId: string }) {
    try {
      const post = await this.postService.create(data.createPostDto, data.authorId);
      return ResponseDto.success(SUCCESS_MESSAGES.POST_CREATED, post);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_FIND_ALL })
  async findAll(@Payload() query: PostQueryDto) {
    try {
      const posts = await this.postService.findAll(query);
      return ResponseDto.success('Posts retrieved successfully', posts);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_FIND_BY_ID })
  async findById(@Payload() data: { id: string }) {
    try {
      const post = await this.postService.findById(data.id);
      return ResponseDto.success('Post retrieved successfully', post);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'post.findBySlug' })
  async findBySlug(@Payload() data: { slug: string }) {
    try {
      const post = await this.postService.findBySlug(data.slug);
      return ResponseDto.success('Post retrieved successfully', post);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_FIND_BY_AUTHOR })
  async findByAuthor(@Payload() data: { authorId: string; query: PostQueryDto }) {
    try {
      const posts = await this.postService.findByAuthor(data.authorId, data.query);
      return ResponseDto.success('Author posts retrieved successfully', posts);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_UPDATE })
  async update(@Payload() data: { id: string; updatePostDto: UpdatePostDto }) {
    try {
      const post = await this.postService.update(data.id, data.updatePostDto);
      return ResponseDto.success(SUCCESS_MESSAGES.POST_UPDATED, post);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_DELETE })
  async delete(@Payload() data: { id: string }) {
    try {
      await this.postService.delete(data.id);
      return ResponseDto.success(SUCCESS_MESSAGES.POST_DELETED);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_PUBLISH })
  async publish(@Payload() data: { id: string }) {
    try {
      const post = await this.postService.publish(data.id);
      return ResponseDto.success(SUCCESS_MESSAGES.POST_PUBLISHED, post);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.POST_UNPUBLISH })
  async unpublish(@Payload() data: { id: string }) {
    try {
      const post = await this.postService.unpublish(data.id);
      return ResponseDto.success('Post unpublished successfully', post);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'post.exists' })
  async exists(@Payload() data: { id: string }) {
    try {
      const exists = await this.postService.exists(data.id);
      return ResponseDto.success('Post existence checked', { exists });
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'post.getAuthorStats' })
  async getAuthorStats(@Payload() data: { authorId: string }) {
    try {
      const stats = await this.postService.getAuthorStats(data.authorId);
      return ResponseDto.success('Author stats retrieved successfully', stats);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'post.health' })
  async healthCheck() {
    return new HealthCheckDto('post-service');
  }
}