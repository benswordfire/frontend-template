import { z } from 'zod';

export const FriendSchema = z.object({
  friendId: z.string(),
  username: z.string().optional(),
});

export type Friend = z.infer<typeof FriendSchema>;