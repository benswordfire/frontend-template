import { z } from 'zod';

export const IncomingCallAnswerSchema = z.object({
  callerId: z.string().min(1, 'Caller ID is required'),
  sdp: z.object({
    type: z.literal('answer'),
    sdp: z.string().min(1, 'SDP string is required'),
  })
});

export type IncomingCallAnswer = z.infer<typeof IncomingCallAnswerSchema>;