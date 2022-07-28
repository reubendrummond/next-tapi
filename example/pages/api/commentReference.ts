import { commentSchema } from "lib/schemas/posts";
import { db } from "server/db";
import { authRouter } from "server/routers";

const router = authRouter();

router
  .body(commentSchema.parse)
  .post(async ({ fields, body: comment, res }) => {
    const newComment = await db.comment.insert({
      ...comment,
      userId: fields.session.user.id,
    });

    res.status(201);
    return {
      success: true,
      data: {
        commment: newComment,
      },
    };
  });

export default router.export();
