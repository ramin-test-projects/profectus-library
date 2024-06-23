/**
 * Allows variable with type 'T' to accept null or undefined
 */
export type Nullable<T> = T | null | undefined;

/**
 * Object with string keys and values of type 'T'
 */
export interface Dictionary<T> {
  [key: string]: T;
}

/**
 * Only one member of object 'T' can have value.
 * e.g.:
 * const test1: OnlyOne<{ key1: string; key2: string }> = { key1: "something" }; --> valid
 * const test2: OnlyOne<{ key1: string; key2: string }> = { key1: "something", key2: "something" }; --> invalid
 */
export type OnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

type Only<T, U, OnlyU = Omit<U, keyof T>> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof OnlyU]?: never;
};

/**
 * Only one of 'T' or 'U' must be provided.
 * e.g.:
 * interface A { key1: string; key2: string }
 * interface B { key2: string; key3: string; }
 * const test1: Either<A, B> = { key1: "something", key2: "something" } --> valid
 * const test2: Either<A, B> = { key2: "something", key3: "something" } --> valid
 * const test3: Either<A, B> = { key1: "something", key3: "something" } --> invalid
 */
export type Either<T, U> = Only<T, U> | Only<U, T>;
