import { ZodType } from 'zod';

export interface FetchParams<T = unknown> {
  endpoint: string;
  data?: unknown;
  schema?: ZodType<T>;
  options?: RequestInit;
}
