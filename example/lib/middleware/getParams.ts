// import { createMiddleware } from "next-tapi";

// export const getParams = <Params extends string[]>(params: Params) =>
//   createMiddleware((req) => {
//     const pairs: { [key in GetStringLiterals<Params>]?: string | null } = {};
//     params.forEach((param) => {
//       const val = req.query[param];
//       pairs[param] = val ? (typeof val === "string" ? val : val[0]) : null;
//     });

//     return pairs;
//     // return {} as Params[keyof Params]
//   });

// type GetStringLiterals<T extends readonly string[]> = T extends [
//   infer First,
//   ...infer Last
// ]
//   ? Last extends string[]
//     ? First | GetStringLiterals<Last>
//     : First | Last
//   : never;

// type T = GetStringLiterals<["id", "name", "smthn"]>;

// const test = getParams(["id", "name"]);
