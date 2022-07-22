# Next tAPI

Next tAPI (NextJS type-safe API) is an intuitive and easy to use abstraction for NextJS API routes.

**Features**:

- fully typed
- Express-like
- simple error handling
- versatile and type-safe middleware

## Installation

```sh
npm install next-tapi       # npm
yarn add next-tapi          # yarn
pnpm add next-tapi          # pnpm
```

## Getting Started

The router is similar to Express.

```ts
// pages/api/some-route

import { Router } from "next-tapi";
const router = new Router();

router.get((req) => { ... });
router.post((req) => { ... });
router.delete((req) => { ... });
router.post((req) => { ... });
router.patch((req) => { ... });

export default router.export()
```

### Type declaration

Declare return types with generics.

```ts
router.get<{ name: string }>((req) => {
  return {
    name: 123456789, // error
  };
});
```

### Error handling

Errors thrown in an API handler will be caught and processed. A custom error handler can be easily added to handler [custom errors](#error-handler). Next tAPI provides its own `ApiError` which is handled with the default error handler.

```ts
import { ApiError } from "next-tapi";

router.get((req) => {
  throw new ApiError(400, "Some error message");
  return {};
});
```

## Middleware

### `createMiddleware`

Middleware should be created with the `createMiddleware` function.

```ts
import { createMiddleware } from "next-tapi";

const authMiddleware = createMiddleware(async (req, res) => {
  const session = await getSession(req, res);
  return {
    session,
  };
});
```

### Consume middleware

Fields returned from middleware are accessible in the callback handler.

```ts
import { authmiddleware } from "path/to/middleware";

router.middleware([authMiddleware]).get((req, fields) => {
  fields.session; // type of session inferred from middleware
  return {
    // ...
  };
});
```

### Errors in middleware

Errors thrown in middleware will be handled as normal.

```ts
import { createMiddleware } from "next-tapi";

const authMiddleware = createMiddleware(async (req, res) => {
  const session = await getSession(req, res); // error handled as normal
  if (!session) throw new ApiError(403, "Forbidden");
  return {
    session,
  };
});
```

### Global middleware

Middleware can be made run from all API routes using the globalMiddleware method.

```ts
import { Router } from "next-tapi";

const router = new Router().globalMiddleware([authMiddleware]);

router.get((req, { session }) => {
  // ...
});

// middleware can still be used
router
  .middleware([validateRequestBody])
  .post((req, { session, validatedBody }) => {
    // ...
  });

export default router.export();
```

## Customisation

### Error handler

A custom error handler can easily be added to handle custom errors or to change the error response.

```ts
import { Router, ErrorHandler } from "next-tapi";

type ErrorResponseShape = {}; // optionally define shape of error response
const myCustomErrorHandler: ErrorHandler<ErrorResponseShape> = (res, err) => {
  // handle error
};

const router = new Router({
  errorHandler: myCustomErrorHandler,
});
```

## Router types

It may be convenient to define a few types of routers with different middleware.

```ts
import { authMiddleware, logRequest } from "path/to/middleware";
import { myCustomErrorHandler } from "path/to/myCustomErrorHandler";
import { Router } from "next-tapi";

export const mainRouter = () => {
  return new Router({
    errorHandler: myCustomErrorHandler,
  }).globalMiddleware([logRequest]);
};

export const authRouter = () => {
  return new Router({
    errorHandler: myCustomErrorHandler,
  }).globalMiddleware([authMiddleware, logRequest]);
};
```
