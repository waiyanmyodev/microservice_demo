import { Transform } from 'class-transformer';
import { isValidUUID, sanitizeSearchQuery } from '../utils/validation.utils';

export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  });
}

export function ToNumber(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  });
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim();
    }
    return value;
  });
}

export function SanitizeString(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
}

export function SanitizeSearch(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return sanitizeSearchQuery(value);
    }
    return value;
  });
}

export function ToArray(): PropertyDecorator {
  return Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [];
  });
}