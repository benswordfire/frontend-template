import { createContext } from '@lit/context';
import { IncomingCallOffer } from '../types/IncomingCallOffer';

export interface ChatContext {
  createCallOffer: (calleeId: string) => Promise<void>;
  createCallAnswer: (incomingCallOffer: IncomingCallOffer) => Promise<void>;
  disableLocalMicrophone: (disable: boolean) => Promise<void>;
  disableLocalCamera: (disable: boolean) => Promise<void>;
  hangupCall: () => Promise<void>;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}
export const chatContext = createContext<ChatContext>('chat-context');