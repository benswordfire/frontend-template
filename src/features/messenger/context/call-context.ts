import { createContext } from '@lit/context';
import { IncomingCallOffer } from '../types/IncomingCallOffer';
import { OutgoingCallOffer } from '../types/OutgoingCallOffer';

export interface CallContext {
  incomingCallOffer: IncomingCallOffer | null;
  outgoingCallOffer: OutgoingCallOffer | null;
  createCallOffer: (calleeId: string) => Promise<void>;
  createCallAnswer: (incomingCallOffer: IncomingCallOffer) => Promise<void>;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export const callContext = createContext<CallContext>('call-context');