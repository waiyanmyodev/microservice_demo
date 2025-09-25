import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { SearchDto } from './common.dto';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags?: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags?: string[];
}

export class PostQueryDto extends SearchDto {
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags?: string[];
}

export class PostResponseDto {
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
    avatar?: string;
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export class PostSummaryDto {
  id: string;
  title: string;
  excerpt?: string;
  slug?: string;
  published: boolean;
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  tags?: string[];
  createdAt: Date;
  publishedAt?: Date;
}