import { registerAs } from '@nestjs/config';

export default registerAs('user', () => ({
  service: {
    port: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
    host: process.env.USER_SERVICE_HOST || '0.0.0.0',
  },
  database: {
    url:
      process.env.USER_DATABASE_URL ||
      'postgresql://postgres:password@localhost:5432/microservices_db',
  },
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT || '10', 10),
    maxLimit: parseInt(process.env.MAX_PAGINATION_LIMIT || '100', 10),
  },
}));
