import { createContext } from '@lit/context';
import type { User } from '../../types/User';
export type { User } from '../../types/User';
export const authContext = createContext<User | null>('auth-context');
