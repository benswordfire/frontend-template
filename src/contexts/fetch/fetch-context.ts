import { createContext } from '@lit/context';
import { FetchParams } from './types/FetchParams';

export interface FetchContext {
  fetchWithAuth: <T>(params: FetchParams<T>) => Promise<T | undefined>;
}

export const fetchContext = createContext<FetchContext>(Symbol('fetch-context'));