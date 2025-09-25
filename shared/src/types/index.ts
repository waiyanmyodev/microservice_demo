export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Constructor<T = {}> = new (...args: any[]) => T;

export type ServiceResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type SortOptions = {
  field: string;
  order: 'asc' | 'desc';
};

export type FilterOptions = {
  [key: string]: any;
};

export type SearchOptions = {
  query?: string;
  filters?: FilterOptions;
  sort?: SortOptions;
  pagination?: {
    page: number;
    limit: number;
  };
};

export type LogContext = {
  userId?: string;
  requestId?: string;
  service?: string;
  action?: string;
  [key: string]: any;
};