import { NextApiRequest } from "next";
import { UnionToIntersection, IsEmptyObject } from "./utils";

export type UnwrapMiddleware<Ms extends RouterMiddleware<any>[]> =
  UnionToIntersection<ReturnType<Ms[number]>>;

export type RouterMiddleware<
  T extends { [key: PropertyKey]: any },
  R = IsEmptyObject<T> extends true ? { [key: PropertyKey]: never } : T
> = (req: NextApiRequest) => R | Promise<R>;
