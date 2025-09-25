import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from '../repository/post.repository';
import postConfig from '../config/post.config';

@Module({
  imports: [
    ConfigModule.forFeature(postConfig),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}