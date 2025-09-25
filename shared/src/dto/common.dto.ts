import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class IdParamDto {
  @IsString()
  id: string;
}

export class ResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(message: string, data?: T): ResponseDto<T> {
    return new ResponseDto(true, message, data);
  }

  static error(message: string, error?: string): ResponseDto<null> {
    return new ResponseDto(false, message, null, error);
  }
}

export class HealthCheckDto {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  service: string;

  constructor(service: string, version: string = '1.0.0') {
    this.status = 'ok';
    this.timestamp = new Date().toISOString();
    this.uptime = process.uptime();
    this.version = version;
    this.service = service;
  }
}