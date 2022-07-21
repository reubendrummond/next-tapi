import { useEffect, useState } from "react";

// these inferred from server
interface User {
  id: number;
  name: string;
}
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

// this generated
export type GETTypeMap = {
  "/api/users": GETApiUsers;
  "/api/users/id/[id]": never;
  [_: `/api/users/id/${number}`]: GETApiUsersId;
  "/api/users/username/[username]": never;
  [_: `/api/users/username/${string}`]: GETApiUsersUsername;
  "/api/users/id/[id]/friends": never;
  [_: `/api/users/id/${number}/friends`]: GETApiUsersIdFriends;
};

// wrapper and hook
const fetchWrapper = async <Endpoint extends keyof GETTypeMap>(
  endpoint: Endpoint
): Promise<GETTypeMap[Endpoint]> => {
  const response = await fetch(endpoint).then((res) => res.json());
  return response;
};

interface Error {
  message: string;
}

interface FetchHookSuccess<Res> {
  isSuccess: true;
  isError: false;
  isLoading: false;
  data: Res;
  error: null;
}
interface FetchHookFail {
  isSuccess: false;
  isError: true;
  isLoading: false;
  data: null;
  error: Error;
}
interface FetchHookLoading {
  isSuccess: false;
  isError: false;
  isLoading: true;
  data: null;
  error: null;
}
type FetchHook<Res> = FetchHookSuccess<Res> | FetchHookFail | FetchHookLoading;

export const useFetch = <Endpoint extends keyof GETTypeMap>(
  endpoint: Endpoint
) => {
  const [data, setData] = useState<FetchHook<GETTypeMap[Endpoint]>>({
    isSuccess: false,
    isError: false,
    isLoading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    fetchWrapper(endpoint).then((response) => {
      setData({
        ...data,
        data: response,
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
      });
    });
  });
  return data;
};

const d = useFetch("/api/users/id/123/friends");

if (d.isSuccess) {
  d.data;
}
