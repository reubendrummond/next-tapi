import { RouterMiddleware } from "../types/middleware";
import { RouterMethodHandler } from "../types/router";
import { IsEmptyObject } from "../types/utils";

const returnMiddleware = <T extends {}>(
  middleware: RouterMiddleware<T>
): RouterMiddleware<
  IsEmptyObject<T> extends true ? Record<PropertyKey, never> : T
> => {
  return middleware;
};

export const authMiddleware = returnMiddleware((req) => {
  // if (error) throw new Error("Authentication error")

  return {
    session: {
      user: {
        id: 1,
        username: "someusername",
      },
    },
  };
});

export const verifyBody = returnMiddleware((req) => {
  // if (!req.body.isValid) throw new Error("Invalid body")

  return {
    verifiedBody: {
      name: "yee",
      id: "woo",
    },
  };
});

export const anotherMiddleware = returnMiddleware((req) => {
  // do some check

  return {};
});

const get: RouterMethodHandler<{}> = (handler) => null;

get(
  [authMiddleware, verifyBody, anotherMiddleware],
  (req, res, { session, verifiedBody }) => {
    res.status(200).json({ success: true, data: { user: session.user } });
  }
);
