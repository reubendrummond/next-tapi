import { createMiddleware } from "next-tapi";

// export const getParams = <Params extends `${string}TTT`[]>(params: Params) =>
//   createMiddleware((req) => {
//     const pairs: { [key in Params[number]]?: string | null } = {};
//     params.forEach((param) => {
//       const val = req.query[param];
//       pairs[param] = val ? (typeof val === "string" ? val : val[0]) : null;
//     });

//     return {} as GetStringLiterals<Params>;
//     // return {} as Params[keyof Params]
//   });

const testFcn = <P extends `[${string}]`[]>(params: P) => {
  const pairs: { [key: PropertyKey]: any } = {};

  params.forEach((param: string) => {
    pairs[param] = "a string";
  });

  return pairs as UnwrapParam<P>;
  //   as {
  //     [key in P[number]]: string | null;
  //   };
};

type UnwrapParam<Params> = Params extends string[]
  ? Params extends [infer First, ...infer Last]
    ? First
    : "never"
  : never;
// type UnwrapParam<Params> = Params extends string[]
//   ? Params extends [infer First, ...infer Last]
//     ? First extends `[${infer Inner}]`
//       ? Inner | UnwrapParam<Last>
//       : never
//     : Params extends [infer First]
//     ? First extends `[${infer Inner}]`
//       ? Inner
//       : never
//     : never
//   : never;

const test2 = testFcn(["[id]", "[name]"]);

type CustomString<T> = T extends `${infer R}` ? R : never;

type GetStringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

type GetStringLiterals<T extends string[]> = T extends [
  infer First,
  ...infer Last
]
  ? Last extends string[]
    ? GetStringLiteral<First> | GetStringLiterals<Last>
    : GetStringLiteral<First> | Last
  : never;

// type GetStringLiterals3<T extends readonly> = T extends Array<infer R>
//   ? R[]
//   : never;

type GetStringLiterals2<S> = S extends `${infer First} ${infer Last}`
  ? First | GetStringLiterals2<Last>
  : S extends `${infer First}`
  ? First
  : never;

type Str = GetStringLiteral<"id">;

export type T = GetStringLiterals2<"id name woo">;

// const test1 = getParams(["id", "name"]);
// const test2 = testFcn(["[id]", "[name]"]);
// test2.
