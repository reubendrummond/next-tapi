import { NextApiRequestQuery } from "next/dist/server/api-utils";

export const createResolver = <TRes extends {}>(
  resolver: (query: NextApiRequestQuery) => TRes
) => {
  return resolver;
};
