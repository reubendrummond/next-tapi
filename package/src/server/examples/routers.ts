import { Router } from "../..";

const r = new Router();

// define type
r.get<{ id: number; name: string }>((req) => {
  return {
    id: 123456789,
    name: "Next Tapi",
  };
});

// or type is inferred
r.post((req) => {
  return {
    id: 123456789,
    name: "Next Tapi",
  };
});
