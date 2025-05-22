import { z } from 'zod'

export const MessageSchema = z.object({
  type: z.enum(['incoming', 'outgoing']),
  text: z.string(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;