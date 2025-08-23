import { z } from 'zod';

export const IncomingCallOfferSchema = z.object({
  callerName: z.string(),
  callerId: z.string().min(1, 'Caller ID is required'),
  sdp: z.object({
    type: z.literal('offer'),
    sdp: z.string().min(1, 'SDP string is required'),
  })
});

export type IncomingCallOffer = z.infer<typeof IncomingCallOfferSchema>;
