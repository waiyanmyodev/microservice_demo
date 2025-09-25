import { DEFAULT_PAGINATION } from '../constants';

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function calculatePagination(
  total: number,
  page: number = DEFAULT_PAGINATION.PAGE,
  limit: number = DEFAULT_PAGINATION.LIMIT,
): {
  skip: number;
  take: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const normalizedLimit = Math.min(limit, DEFAULT_PAGINATION.MAX_LIMIT);
  const normalizedPage = Math.max(page, 1);
  const totalPages = Math.ceil(total / normalizedLimit);
  const skip = (normalizedPage - 1) * normalizedLimit;

  return {
    skip,
    take: normalizedLimit,
    totalPages,
    hasNext: normalizedPage < totalPages,
    hasPrev: normalizedPage > 1,
  };
}

export function createPaginationResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> {
  const { totalPages, hasNext, hasPrev } = calculatePagination(total, page, limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
  };
}