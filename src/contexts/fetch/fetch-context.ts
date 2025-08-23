import { createContext } from '@lit/context';

export interface FetchContext {
  requestWithAuth: (method: string, endpoint: string, formData?: object) => Promise<any>;
  _requestWithoutAuth: (method: string, endpoint: string) => Promise<any>;
}

export const fetchContext = createContext<FetchContext>(Symbol('fetch-context'));