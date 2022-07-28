import { commentSchema } from "lib/schemas/posts";
import { db } from "server/db";
import { authRouter } from "server/routers";

const router = authRouter();

router.body(commentSchema.parse).post(async ({ body, fields, res }) => {
  const newComment = await db.comment.insert({
    ...body,
    userId: fields.session.user.id,
  });

  res.status(201);
  return {
    success: true,
    data: { comment: newComment },
  };
});

export default router.export();
