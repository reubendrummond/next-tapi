import { z } from "zod";
import { createResolver } from "../createResolver";

/*
makeNonNullable
makeStringOrUndefined
getParam(["id"])
zodResolve(zodSchema)
yupResolve(yupSchema)
*/

export const zodResolve = <TSchema extends z.ZodObject<any>>(schema: TSchema) =>
  createResolver((body) => {
    return schema.parse(body);
  });
