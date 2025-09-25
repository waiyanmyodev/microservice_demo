export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

export const PASSWORD_CONFIG = {
  MIN_LENGTH: 6,
  SALT_ROUNDS: 12,
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters long`,
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters long',
  REQUIRED_FIELD: 'This field is required',
  INVALID_UUID: 'Invalid UUID format',
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  POST_NOT_FOUND: 'Post not found',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',
  SERVER_ERROR: 'Internal server error',
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_PUBLISHED: 'Post published successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
} as const;

export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  AUTH_SERVICE: 3001,
  USER_SERVICE: 3002,
  POST_SERVICE: 3003,
} as const;

export const CACHE_TTL = {
  USER_PROFILE: 300, // 5 minutes
  POST_LIST: 600,    // 10 minutes
  AUTH_TOKEN: 900,   // 15 minutes
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;