import { z } from 'zod';

export const FriendSearchResultSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export type FriendSearchResult = z.infer<typeof FriendSearchResultSchema>;