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
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  MessagePatterns,
  IdParamDto,
} from '@shared/common';
import { MicroserviceClientService } from '../common/microservice-client.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly microserviceClient: MicroserviceClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_CREATE }, createUserDto)
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.CONFLICT);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Query() query: UserQueryDto) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_FIND_ALL }, query)
        .toPromise();

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get users',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getMyProfile(@Request() req: any) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_GET_PROFILE }, { id: req.user.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get profile',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param() params: IdParamDto) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_FIND_BY_ID }, { id: params.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateMyProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_UPDATE }, { id: req.user.id, updateUserDto })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update profile',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param() params: IdParamDto, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_UPDATE }, { id: params.id, updateUserDto })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param() params: IdParamDto) {
    try {
      const result = await this.microserviceClient.userClient
        .send({ cmd: MessagePatterns.USER_DELETE }, { id: params.id })
        .toPromise();

      if (!result.success) {
        throw new HttpException(result.error, HttpStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}