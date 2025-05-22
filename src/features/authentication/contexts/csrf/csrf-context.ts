import { createContext } from '@lit/context';
export const csrfContext = createContext<string | null>('csrf-context');