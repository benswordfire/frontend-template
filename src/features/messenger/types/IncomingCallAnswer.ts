import { z } from 'zod';

export const IncomingCallAnswerSchema = z.object({
  offer: z.object({
    type: z.literal('answer', { errorMap: () => ({ message: 'Answer type must be "answer"' }) }),
    sdp: z.string().min(1, 'SDP string is required')
  }),
});

export type IncomingCallAnswer = z.infer<typeof IncomingCallAnswerSchema>;