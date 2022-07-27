import { NextApiRequestQuery } from "next/dist/server/api-utils";

export const createQueryResolver = <TRes extends {}>(
  resolver: (query: NextApiRequestQuery) => TRes
) => {
  return resolver;
};

export const createResolver = <TRes extends {}>(
  resolver: (body: any) => TRes
) => {
  return resolver;
};
