import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { SearchDto } from './common.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}

export class UserQueryDto extends SearchDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileDto {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}