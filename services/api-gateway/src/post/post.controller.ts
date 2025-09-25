import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  MessagePatterns,
  IdParamDto,
} from '@shared/common';
import { MicroserviceClientService } from '../common/microservice-client.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../common/public.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly microserviceClient: MicroserviceClientService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  async create(@Request() req: any, @Body() createPostDto: CreatePostDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_CREATE }, { createPostDto, authorId: req.user.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @ApiQuery({ name: 'authorId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async findAll(@Query() query: PostQueryDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_FIND_ALL }, query)
        .toPromise();

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get posts',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User posts retrieved successfully' })
  async getMyPosts(@Request() req: any, @Query() query: PostQueryDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_FIND_BY_AUTHOR }, { authorId: req.user.id, query })
        .toPromise();

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get user posts',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param() params: IdParamDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_FIND_BY_ID }, { id: params.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post by ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(@Param() params: IdParamDto, @Body() updatePostDto: UpdatePostDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_UPDATE }, { id: params.id, updatePostDto })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param() params: IdParamDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_DELETE }, { id: params.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish post' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  async publish(@Param() params: IdParamDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_PUBLISH }, { id: params.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to publish post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/unpublish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish post' })
  @ApiResponse({ status: 200, description: 'Post unpublished successfully' })
  async unpublish(@Param() params: IdParamDto) {
    try {
      const result = await this.microserviceClient.postClient
        .send({ cmd: MessagePatterns.POST_UNPUBLISH }, { id: params.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to unpublish post',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}