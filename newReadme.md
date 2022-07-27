# Next tAPI

Next tAPI (Next.js typesafe API) is an intuitive and powerful abstraction of [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction). Taking inspiration from [tRPC](https://trpc.io/), Next tAPI is DX focussed, making the development of your Next.js API easier, safer, and more enjoyable.

**Features:**

- fully typed
- middleware with type inference
- simple error handling
- enforce response consistency

## Installation

```sh
npm install next-tapi       # npm
yarn add next-tapi          # yarn
pnpm add next-tapi          # pnpm
```

## Getting Started

Define API method handlers on the router object and export.

```ts
// pages/api/some-route
import { createRouter } from "next-tapi";
const router = createRouter();

router.get(({ res, res, ...}) => { ... });
router.post(({ res, res, ...}) => { ... });
router.delete(({ res, res, ...}) => { ... });
router.put(({ res, res, ...}) => { ... });
router.patch(({ res, res, ...}) => { ... });

export default router.export();
```

The object returned by each method handler will be sent. The status code can be changed as usual on the `res` object.

```ts
router.get(({ res }) => {
    // create some resource
    res.status(201);
    return { ... }
}
```

### Defining response type

It may be useful to define a return type which can be done by defining the generic function.

```ts
router.get<{ id: number }>(() => {
  return {
    id: "123", // error, must be a number
  };
});
```

### Error handling

Errors thrown in an API handler will be caught and processed. A custom error handler can be easily added to handler [custom errors](#error-handler). Next tAPI provides its own `TapiError` which is handled with the default error handler.

```ts
import { TapiError } from "next-tapi";

router.get((req) => {
  throw new TapiError({ statusL 400, message: "Oh no!" });
  return { ... };
});
```

## Middleware

Middleware in Next tAPI is similar to [Express](https://expressjs.com/en/guide/using-middleware.html) but **typed** variables are accessible in subsequent middleware and method handlers in the `fields` object.

```ts
router
  .middleware(async ({ req, res, next }) => {
    const session = await getSession(req, res);
    return next({
      session,
    });
  })
  .middleware(({ fields, next }) => {
    fields.session; // fully typed
    return next();
  })
  .get(({ fields }) => {
    fields.session; // fully typed
    return {};
  });
```

### Reusing middleware

Reusable middleware can be created with the `createMiddleware` function.

```ts
export const authMiddleware = createMiddleware(async ({ req, res, next }) => {
  const session = await getSession(req, res);
  if (!session) throw new TapiError({ status: 403, "Not allowed!");

  return next({
    session
  });
});
```

The middleware can be easily consumed.

```ts
import { authMiddleware } from "path/to/middleware"

router.middleware(authMiddleware).get(({ fields }) => {
    fields.session // typed
    return { ... }
})
```

## Special middleware

Before defining the method handler, the `body` and `query` methods can be defined which validate the request body and query respectively, which are then available in the method handler. Next tAPI is agnostic to validation libraries; however, this can be done easily with [zod](https://github.com/colinhacks/zod), [yup](https://github.com/jquense/yup), or other validation libraries.

### Zod

```ts
router
  .body(zodBodySchema.parse)
  .query(zodQuerySchema.parse)
  .get(({ body }) => {
    // body and query typesafe
    return { ... };
  })

```

### Yup

```ts
router
  .body((body) => yupBodySchema.cast(body))
  .query((query) => yupQuerySchema.cast(query))
  .post(({ body }) => {
    // body and query typesafe
    return { ... };
  });

```

Reusable query and body resolvers can be created with the `createQueryResolver` and `createResolver` functions.
