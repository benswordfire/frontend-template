import { z } from 'zod';

export const OutgoingCallOfferSchema = z.object({
  calleeId: z.string().min(1, 'Callee ID is required'),
  callerId: z.string().min(1, 'Caller ID is required'),
  offer: z.object({
    type: z.literal('offer', { errorMap: () => ({ message: 'Offer type must be "offer"' }) }),
    sdp: z.string().min(1, 'SDP string is required')
  }),
});

export type OutgoingCallOffer = z.infer<typeof OutgoingCallOfferSchema>;