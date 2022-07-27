# Next tAPI

Next tAPI (Next.js typesafe API) is an intuitive and powerful abstraction of [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction). Taking inspiration from [tRPC](https://trpc.io/), Next tAPI is DX focussed, making the development of your Next.js API easier, safer, and more enjoyable.

**Features:**

- fully typed
- middleware with type inference
- simple error handling
- enforce response type consistency

## Contents
  - [Installation](#installation)
  - [Getting Started](#getting-started)
    - [Defining response type](#defining-response-type)
    - [Error handling](#error-handling)
  - [Middleware](#middleware)
    - [Error handling in middleware](#error-handling-in-middleware)
    - [Reusing middleware](#reusing-middleware)
  - [Special middleware](#special-middleware)
    - [Zod](#zod)
    - [Yup](#yup)
  - [Customisation](#customisation)
    - [Enforcing response types](#enforcing-response-types)
    - [Custom error handler](#custom-error-handler)
    - [Router types](#router-types)
  - [Comparison](#comparison)
    - [Method handlers](#method-handlers)
    - [Error handling](#error-handling-1)
  - [Coming soon](#coming-soon)

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
})
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

Errors thrown in an API method handler or middleware will be caught and processed. A custom error handler can be easily added to handle [custom errors](#error-handler). Next tAPI provides its own `TapiError` which is handled with the default error handler.

```ts
import { TapiError } from "next-tapi";

router.get((req) => {
  throw new TapiError({ status: 400, message: "Oh no!" });
  return { ... };
});
```

## Middleware

Middleware in Next tAPI is similar to [Express](https://expressjs.com/en/guide/using-middleware.html) but **typed** variables are accessible in subsequent middleware and method handlers in the `fields` object.

Note that Next tAPI middleware does not a replacement for [Next.js middleware](https://nextjs.org/docs/advanced-features/middleware). Next tAPI middleware is especially useful when typed variables want to be passed to a method handler.

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
    return { ... };
  });
```

### Error handling in middleware

Errors thrown in middleware will be handled as normal by the [error handler](#error-handler).

```ts
router.middleware(async ({ req, res, next }) => {
  throw new TapiError({ status: 400, message: "Oh no!" });
  return next();
});
```

### Reusing middleware

Reusable middleware can be created with the `createMiddleware` function.

```ts
export const authMiddleware = createMiddleware(asyncc ({ req, res, next }) => {
  const session = await getSession(req, res);
  if (!session) throw new TapiError({ status: 403, "Not allowed!" });

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

Before defining the method handler, the `body` and `query` methods can be defined which validate the request body and query respectively, which are then available in the method handler. Next tAPI is agnostic to choice of validation; however, this can be done easily with [zod](https://github.com/colinhacks/zod), [yup](https://github.com/jquense/yup), or other validation libraries.

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

## Customisation

### Enforcing response types

Responses returned by method handlers can be forced to extend a certain shape. Let's say we wanted all successful responses to extend the following interface:

```ts
interface StandardSuccessResponse<T extends {}> {
  success: true;
  data: T;
}
```

We could do so using the generic:

```ts
const router = createRouter<StandardSuccessResponse<{}, StandardErrorResponse>>();

router.get(() => {
    return {
        user: { ... } // error, does not extend StandardSuccessResponse<{}>
    }
}
```

Response types defined must also extend the specified type.

```ts
router.get<StandardResponse<{ name: string }>>(() => {
    return {
        success: true,
        data: { name: "Next tAPI" }
    }
}
```

### Custom error handler

A custom error handler can easily be added to handle custom errors or to change the error response.

```ts
interface StandardErrorResponse {
  success: false;
  error: { message: string };
}

const myCustomErrorHandler: ErrorHandler<StandardErrorResponse> = (
  req,
  res,
  err
) => {
  // handle error
  return res.status(400).json({
    success: false,
    error: {
      message: "Oh no!",
    },
  });
};

const router = createRouter<StandardSuccessResponse<{}>, StandardErrorResponse>(
  {
    errorHandler: myCustomErrorHandler,
  }
);
```

### Router types

It may be convenient to define a few types of routers with different middleware.

```ts
import { authMiddleware, logRequest } from "path/to/middleware";
import { myCustomErrorHandler } from "path/to/myCustomErrorHandler";
import { createRouter } from "next-tapi";

export const mainRouter = () => {
  return createRouter<StandardSuccessResponse<{}>>({
    errorHandler: myCustomErrorHandler,
  }).middleware(logRequest);
};

export const authRouter = () => {
  return createRouter<StandardSuccessResponse<{}>>({
    errorHandler: myCustomErrorHandler,
  })
    .middleware(logRequest)
    .middleware(authMiddleware);
};
```

## Comparison

### Method handlers

**Regular Next.js**

Without an abstraction like Next tAPI, API routes get extremely repetitive.

```ts
const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGET(req, res);
    case "POST":
      return handlePOST(req, res);
    default:
      return res.status(405).json({
        error: `${req.method} method not supported.`,
      });
  }
};

export default handler;
```

**Next tAPI**

Forget the switch-case, or other unideal solutions. Define the methods you want to support and the [error handler](#custom-error-handler) will take care of the rest.

```ts
import { createRouter } from "next-tapi";
const router = createRouter();

router.get(() => {
    return { ... }
})

router.post(() => {
    return { ... }
})

export default router.export();
```

### Error handling

**Regular Next.js**

Sending errors (especially in a consistent way) is especially annoying in regular API routes.

```ts
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET")
    return res.status(405).json({
      error: `${req.method} method not supported.`,
    });

  const session = await getSession(req, res);

  if (!session)
    return res.status(401).json({
      error: `You must be authenticated.`,
    });

  if (!session.role === "ADMIN")
    return res.status(403).json({
      error: `You are not authorised to access this resource.`,
    });

  try {
    const data = await db.query("some_table").where({
      user_id: session.user.id,
    });

    if (!data)
      return res.status(404).json({
        error: "Resource not found",
      });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({
      error: "Some DB error.",
    });
  }
};
```

**Next tAPI**

Simply throw errors in the handler body and consistently handle errors in the error handler. This is similar to [Express](https://expressjs.com/en/guide/error-handling.html).

```ts
router.middleware(authMiddleware).get(async ({ fields }) => {
  const data = await db.query("some_table").where({
    user_id: session.user.id,
  });
  if (!data) throw new TapiError({ status: 404, message: "Oh no!" });
  return { data };
});
```

## Coming soon

- end-to-end type safety
