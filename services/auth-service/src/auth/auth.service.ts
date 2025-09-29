import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  AuthResponseDto,
  IJwtPayload,
  ITokens,
  UserAlreadyExistsException,
  InvalidTokenException,
} from '@shared/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      },
      tokens,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { username: registerDto.username }],
      },
    });

    if (existingUser) {
      throw new UserAlreadyExistsException('User with this email or username already exists');
    }

    // Hash password
    const saltRounds = this.configService.get<number>('auth.bcrypt.saltRounds') || 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      },
      tokens,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<ITokens> {
    try {
      this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get<string>('auth.jwt.refreshSecret'),
      });

      // Check if refresh token exists and is not revoked
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshTokenDto.refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        throw new InvalidTokenException('Invalid or expired refresh token');
      }

      // Revoke old refresh token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(storedToken.user);
      await this.saveRefreshToken(storedToken.user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new InvalidTokenException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
  }

  private async generateTokens(user: any): Promise<ITokens> {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwt.secret'),
        expiresIn: this.configService.get<string>('auth.jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('auth.jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresIn = this.configService.get<string>('auth.jwt.refreshExpiresIn') || '7d';
    const expiresAt = new Date();

    // Parse expiration time (e.g., '7d' -> 7 days)
    if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn.replace('d', ''), 10);
      expiresAt.setDate(expiresAt.getDate() + days);
    } else if (expiresIn.endsWith('h')) {
      const hours = parseInt(expiresIn.replace('h', ''), 10);
      expiresAt.setHours(expiresAt.getHours() + hours);
    } else if (expiresIn.endsWith('m')) {
      const minutes = parseInt(expiresIn.replace('m', ''), 10);
      expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    }

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
