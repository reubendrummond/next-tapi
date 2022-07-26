type IsEmptyObject<Obj extends Record<PropertyKey, unknown>> = [
  keyof Obj
] extends [never]
  ? true
  : false;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type EmptyObject = {
  [key: PropertyKey]: never;
};

type FormatObjectIntersection<T1 extends {}, T2 extends {}> = {
  [Key in keyof T1 | keyof T2]: Key extends keyof T1
    ? T1[Key]
    : Key extends keyof T2
    ? T2[Key]
    : never;
};
