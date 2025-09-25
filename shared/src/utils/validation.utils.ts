import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export async function validateDto<T extends object>(
  cls: new () => T,
  plain: any,
): Promise<{ isValid: boolean; errors: string[]; data?: T }> {
  const dto = plainToClass(cls, plain);
  const validationErrors = await validate(dto);

  if (validationErrors.length === 0) {
    return { isValid: true, errors: [], data: dto };
  }

  const errors = validationErrors.flatMap(error => 
    Object.values(error.constraints || {})
  );

  return { isValid: false, errors };
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100);
}