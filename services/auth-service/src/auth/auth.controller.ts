import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ResponseDto,
  MessagePatterns,
  SUCCESS_MESSAGES,
  HealthCheckDto,
} from '@shared/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: MessagePatterns.AUTH_LOGIN })
  async login(@Payload() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return ResponseDto.success(SUCCESS_MESSAGES.LOGIN_SUCCESS, result);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.AUTH_REGISTER })
  async register(@Payload() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return ResponseDto.success(SUCCESS_MESSAGES.USER_CREATED, result);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.AUTH_REFRESH })
  async refreshTokens(@Payload() refreshTokenDto: RefreshTokenDto) {
    try {
      const tokens = await this.authService.refreshTokens(refreshTokenDto);
      return ResponseDto.success(SUCCESS_MESSAGES.TOKEN_REFRESHED, tokens);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.AUTH_LOGOUT })
  async logout(@Payload() data: { refreshToken: string }) {
    try {
      await this.authService.logout(data.refreshToken);
      return ResponseDto.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.AUTH_VALIDATE })
  async validateUser(@Payload() data: { email: string; password: string }) {
    try {
      const user = await this.authService.validateUser(data.email, data.password);
      if (!user) {
        return ResponseDto.error('Invalid credentials');
      }
      return ResponseDto.success('User validated', user);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'auth.health' })
  async healthCheck() {
    return new HealthCheckDto('auth-service');
  }
}