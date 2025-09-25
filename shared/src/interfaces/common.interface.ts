export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HealthCheck {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  service: string;
}

export interface MessagePattern {
  cmd: string;
}

export interface ServiceConfig {
  port: number;
  host?: string;
  name: string;
}

export interface DatabaseConfig {
  url: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}