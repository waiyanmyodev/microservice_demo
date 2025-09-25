import { registerAs } from '@nestjs/config';

export default registerAs('post', () => ({
  service: {
    port: parseInt(process.env.POST_SERVICE_PORT, 10) || 3003,
    host: process.env.POST_SERVICE_HOST || '0.0.0.0',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/microservices_db',
  },
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT, 10) || 10,
    maxLimit: parseInt(process.env.MAX_PAGINATION_LIMIT, 10) || 100,
  },
  excerpt: {
    defaultLength: parseInt(process.env.DEFAULT_EXCERPT_LENGTH, 10) || 150,
  },
}));