import z from "zod";

export const testSchema = z.object({
  name: z.string(),
  age: z.number().int(),
});

export const commentSchema = z.object({
  body: z.string(),
  postId: z.number().int(),
});
