import { registerAs } from '@nestjs/config';

export default registerAs('post', () => ({
  service: {
    port: parseInt(process.env.POST_SERVICE_PORT || '3003', 10),
    host: process.env.POST_SERVICE_HOST || '0.0.0.0',
    tcpPort: parseInt(process.env.POST_SERVICE_TCP_PORT || '3013', 10) || 3013,
  },
  database: {
    url:
      process.env.POST_DATABASE_URL ||
      'postgresql://postgres:password@localhost:5432/microservices_db',
  },
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT || '10', 10),
    maxLimit: parseInt(process.env.MAX_PAGINATION_LIMIT || '100', 10),
  },
  excerpt: {
    defaultLength: parseInt(process.env.DEFAULT_EXCERPT_LENGTH || '150', 10),
  },
}));
