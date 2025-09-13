import { z } from 'zod';

export const FriendSchema = z.object({
  requesterId: z.string(),
  friendId: z.string(),
  username: z.string().optional(),
});

export type Friend = z.infer<typeof FriendSchema>;