import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserResponseDto,
  UserProfileDto,
  PaginationResult,
  UserNotFoundException,
  UserAlreadyExistsException,
} from '@shared/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.countByEmail(createUserDto.email),
      this.userRepository.countByUsername(createUserDto.username),
    ]);

    if (existingEmail > 0) {
      throw new UserAlreadyExistsException('User with this email already exists');
    }

    if (existingUsername > 0) {
      throw new UserAlreadyExistsException('User with this username already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.transformUserToResponse(user);
  }

  async findAll(query: UserQueryDto): Promise<PaginationResult<UserResponseDto>> {
    const result = await this.userRepository.findAll(query);
    return {
      ...result,
      items: result.items.map(user => this.transformUserToResponse(user)),
    };
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.transformUserToResponse(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    return this.transformUserToResponse(user);
  }

  async getProfile(id: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    const fullName =
      user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      fullName,
      avatar: user.avatar || undefined,
      bio: user.bio || undefined,
      location: user.location || undefined,
      website: user.website || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    // Check for email conflicts
    if (updateUserDto.email) {
      const emailCount = await this.userRepository.countByEmail(updateUserDto.email, id);
      if (emailCount > 0) {
        throw new UserAlreadyExistsException('User with this email already exists');
      }
    }

    // Check for username conflicts
    if (updateUserDto.username) {
      const usernameCount = await this.userRepository.countByUsername(updateUserDto.username, id);
      if (usernameCount > 0) {
        throw new UserAlreadyExistsException('User with this username already exists');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return this.transformUserToResponse(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.userRepository.exists(id);
  }

  private transformUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      avatar: user.avatar || undefined,
      bio: user.bio || undefined,
      location: user.location || undefined,
      website: user.website || undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
