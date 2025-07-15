import { createContext } from '@lit/context';
import type { User } from '../types/User'
export type { User } from '../types/User';
export const profileContext = createContext<User | null>('profile-context');
