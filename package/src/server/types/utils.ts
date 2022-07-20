export type IsEmptyObject<Obj extends Record<PropertyKey, unknown>> = [
  keyof Obj
] extends [never]
  ? true
  : false;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
