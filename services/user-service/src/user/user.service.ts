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
  ValidationException,
  SUCCESS_MESSAGES,
} from '@shared/common';
import { UserRepository } from '../repository/user.repository';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }

  async findAll(query: UserQueryDto): Promise<PaginationResult<UserResponseDto>> {
    return this.userRepository.findAll(query);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user as UserResponseDto;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }

  async getProfile(id: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    const fullName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : null;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
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
    return updatedUser as UserResponseDto;
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
}