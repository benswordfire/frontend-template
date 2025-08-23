import { z } from 'zod';

export const FriendSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
});

export type Friend = z.infer<typeof FriendSchema>;