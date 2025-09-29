import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10) || 12,
  },
  service: {
    port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10) || 3001,
    host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
    tcpPort: parseInt(process.env.AUTH_SERVICE_TCP_PORT || '3011', 10) || 3011,
  },
  database: {
    url:
      process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/microservices_db',
  },
}));
