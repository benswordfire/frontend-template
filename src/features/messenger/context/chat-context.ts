import { createContext } from '@lit/context';

export interface ChatContext {
  createCallOffer: (calleeId: string) => Promise<void>;
}
export const chatContext = createContext<ChatContext>('chat-context');