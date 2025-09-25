export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export enum ServiceNames {
  API_GATEWAY = 'api-gateway',
  AUTH_SERVICE = 'auth-service',
  USER_SERVICE = 'user-service',
  POST_SERVICE = 'post-service',
}

export enum MessagePatterns {
  // Auth patterns
  AUTH_LOGIN = 'auth.login',
  AUTH_REGISTER = 'auth.register',
  AUTH_REFRESH = 'auth.refresh',
  AUTH_VALIDATE = 'auth.validate',
  AUTH_LOGOUT = 'auth.logout',

  // User patterns
  USER_CREATE = 'user.create',
  USER_FIND_ALL = 'user.findAll',
  USER_FIND_BY_ID = 'user.findById',
  USER_FIND_BY_EMAIL = 'user.findByEmail',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_GET_PROFILE = 'user.getProfile',

  // Post patterns
  POST_CREATE = 'post.create',
  POST_FIND_ALL = 'post.findAll',
  POST_FIND_BY_ID = 'post.findById',
  POST_FIND_BY_AUTHOR = 'post.findByAuthor',
  POST_UPDATE = 'post.update',
  POST_DELETE = 'post.delete',
  POST_PUBLISH = 'post.publish',
  POST_UNPUBLISH = 'post.unpublish',
}