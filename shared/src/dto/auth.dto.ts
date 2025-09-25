import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
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

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}

export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}