import { useEffect, useState } from "react";

// these inferred from server
interface User {
  id: number;
  name: string;
}

// GET
interface GETApiUsers {
  users: User[];
}
interface GETApiUsersId {
  id: string;
  user: User;
}
interface GETApiUsersUsername {
  username: string;
  user: User;
}
interface GETApiUsersIdFriends {
  friends: User[];
  user: User;
}

// POST
type POSTApiUserBody = User;
interface POSTApiUsers {
  status: 201;
  user: User;
}
type POSTApiUsersIdFriendsBody = User[];
interface POSTApiUsersIdFriends {
  status: 201;
  friends: User[];
}

type GETResAndQuery<Res, QueryParams extends {} = {}> = {
  response: Res;
  query?: QueryParams;
};

type POSTResAndBodyAndQuery<
  Res,
  BodySchema extends {} = {},
  QueryParams extends {} = {}
> = {
  response: Res;
  body: BodySchema;
  query?: QueryParams;
};

export type GETTypeMap = {
  "/api/users": GETResAndQuery<GETApiUsers>;
  "/api/users/id/[id]": never;
  [_: `/api/users/id/${number}`]: GETResAndQuery<GETApiUsersId>;
  "/api/users/username/[username]": never;
  [_: `/api/users/username/${string}`]: GETResAndQuery<GETApiUsersUsername>;
  "/api/users/id/[id]/friends": never;
  [_: `/api/users/id/${number}/friends`]: GETResAndQuery<
    GETApiUsersIdFriends,
    { all?: boolean }
  >;
};

export type POSTTypeMap = {
  "/api/users": POSTResAndBodyAndQuery<POSTApiUsers, POSTApiUserBody>;
  "/api/users/id/[id]/friends": never;
  [_: `/api/users/id/${number}/friends`]: POSTResAndBodyAndQuery<
    POSTApiUsersIdFriends,
    POSTApiUsersIdFriendsBody
  >;
};

export const fetcher = {
  get: async <Endpoint extends keyof GETTypeMap>(
    endpoint: Endpoint,
    options?: {
      query?: GETTypeMap[Endpoint]["query"];
    }
  ): Promise<GETTypeMap[Endpoint]> => {
    // append query
    const response = await fetch(endpoint).then((res) => res.json());
    return response;
  },
  post: async <Endpoint extends keyof POSTTypeMap>(
    endpoint: Endpoint,
    options: {
      body: POSTTypeMap[Endpoint]["body"];
      query?: POSTTypeMap[Endpoint]["query"];
    }
  ): Promise<GETTypeMap[Endpoint]> => {
    // append query
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(options.body),
    }).then((res) => res.json());
    return response;
  },
};

const getRes = fetcher.get("/api/users/id/123/friends");
const getResWithQuery = fetcher.get("/api/users/id/123/friends", {
  query: {
    all: true,
  },
});
const postRes = fetcher.post("/api/users", {
  body: {
    id: 123,
    name: "my name",
  },
});
