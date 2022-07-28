import { commentSchema } from "lib/schemas/posts";
import { z } from "zod";

export const db = {
  comment: {
    insert: async (
      message: z.infer<typeof commentSchema> & { userId: number }
    ) => ({ id: 1, ...message }),
  },
};
