import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { PrismaService } from '../prisma/prisma.service';
import authConfig from '../config/auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule,
    JwtModule.register({}), // Configuration is handled in the service
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
