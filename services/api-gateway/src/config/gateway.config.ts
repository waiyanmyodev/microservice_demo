import { registerAs } from '@nestjs/config';

export default registerAs('gateway', () => ({
  port: parseInt(process.env.API_GATEWAY_PORT || '3000', 10),
  host: process.env.API_GATEWAY_HOST || '0.0.0.0',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  services: {
    auth: {
      host: process.env.AUTH_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.AUTH_SERVICE_TCP_PORT || '3011', 10),
    },
    user: {
      host: process.env.USER_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.USER_SERVICE_TCP_PORT || '3012', 10),
    },
    post: {
      host: process.env.POST_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.POST_SERVICE_TCP_PORT || '3013', 10),
    },
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  },
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000'],
    credentials: true,
  },
}));
