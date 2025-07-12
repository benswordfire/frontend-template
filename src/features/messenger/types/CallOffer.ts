import { z } from 'zod';

export const CallOfferSchema = z.object({
  callerId: z.string().min(1, 'Caller ID is required'),
  calleeId: z.string().min(1, 'Callee ID is required'),
  offer: z.object({
    type: z.literal('offer', { errorMap: () => ({ message: 'Offer type must be "offer"' }) }),
    sdp: z.string().min(1, 'SDP string is required')
  }),
  _csrf: z.string().min(1, 'CSRF token is required')
});

export type CallOffer = z.infer<typeof CallOfferSchema>;