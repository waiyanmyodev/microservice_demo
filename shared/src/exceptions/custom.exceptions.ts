import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message: string = 'User not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(message: string = 'User already exists') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class PostNotFoundException extends HttpException {
  constructor(message: string = 'Post not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden access') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InvalidTokenException extends HttpException {
  constructor(message: string = 'Invalid token') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class TokenExpiredException extends HttpException {
  constructor(message: string = 'Token has expired') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ValidationException extends HttpException {
  constructor(errors: string[] | string) {
    const message = Array.isArray(errors) ? errors.join(', ') : errors;
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ServiceUnavailableException extends HttpException {
  constructor(service: string) {
    super(`${service} is temporarily unavailable`, HttpStatus.SERVICE_UNAVAILABLE);
  }
}