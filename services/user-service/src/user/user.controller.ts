import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  ResponseDto,
  MessagePatterns,
  SUCCESS_MESSAGES,
  HealthCheckDto,
} from '@shared/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @MessagePattern({ cmd: MessagePatterns.USER_CREATE })
  async create(@Payload() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return ResponseDto.success(SUCCESS_MESSAGES.USER_CREATED, user);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.USER_FIND_ALL })
  async findAll(@Payload() query: UserQueryDto) {
    try {
      const users = await this.userService.findAll(query);
      return ResponseDto.success('Users retrieved successfully', users);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.USER_FIND_BY_ID })
  async findById(@Payload() data: { id: string }) {
    try {
      const user = await this.userService.findById(data.id);
      return ResponseDto.success('User retrieved successfully', user);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.USER_FIND_BY_EMAIL })
  async findByEmail(@Payload() data: { email: string }) {
    try {
      const user = await this.userService.findByEmail(data.email);
      return ResponseDto.success('User retrieved successfully', user);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.USER_GET_PROFILE })
  async getProfile(@Payload() data: { id: string }) {
    try {
      const profile = await this.userService.getProfile(data.id);
      return ResponseDto.success('User profile retrieved successfully', profile);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.USER_UPDATE })
  async update(@Payload() data: { id: string; updateUserDto: UpdateUserDto }) {
    try {
      const user = await this.userService.update(data.id, data.updateUserDto);
      return ResponseDto.success(SUCCESS_MESSAGES.USER_UPDATED, user);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: MessagePatterns.USER_DELETE })
  async delete(@Payload() data: { id: string }) {
    try {
      await this.userService.delete(data.id);
      return ResponseDto.success(SUCCESS_MESSAGES.USER_DELETED);
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'user.exists' })
  async exists(@Payload() data: { id: string }) {
    try {
      const exists = await this.userService.exists(data.id);
      return ResponseDto.success('User existence checked', { exists });
    } catch (error) {
      return ResponseDto.error(error.message, error.name);
    }
  }

  @MessagePattern({ cmd: 'user.health' })
  async healthCheck() {
    return new HealthCheckDto('user-service');
  }
}