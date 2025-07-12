import { createContext } from '@lit/context';
import { AppError } from './types/AppError';

export interface ErrorContext {
  errors: AppError[];
  reportError: (error: Omit<AppError, 'id' | 'timestamp'>) => Promise<void>;
  clearErrors: () => Promise<void>;
};

export const errorContext = createContext<ErrorContext>(Symbol('error-context'));