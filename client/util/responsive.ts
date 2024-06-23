import { Dictionary } from "@/types/basic";

const normalSizeList = ["xs", "sm", "md", "lg", "xl"] as const;

const exclusiveSizeList = [
  "xsOnly",
  "smOnly",
  "mdOnly",
  "lgOnly",
  "xlOnly",
] as const;

type NormalSize = (typeof normalSizeList)[number];
type ExclusiveSize = (typeof exclusiveSizeList)[number];
type Size = NormalSize | ExclusiveSize;

const sizeRef: { [key in NormalSize]: Size[] } = {
  xs: ["xsOnly", "xs", "sm", "md", "lg", "xl"],
  sm: ["smOnly", "sm", "xs", "md", "lg", "xl"],
  md: ["mdOnly", "md", "sm", "xs", "lg", "xl"],
  lg: ["lgOnly", "lg", "md", "sm", "xs", "xl"],
  xl: ["xlOnly", "xl", "lg", "md", "sm", "xs"],
};

export type Responsive<T> = T | { [s in Size]?: T };

const getValueForSize = <T>({
  size,
  value,
}: {
  size: NormalSize;
  value: Responsive<T>;
}) => {
  const isT = [...normalSizeList, ...exclusiveSizeList].every(
    (k) => typeof (value as Dictionary<T> | undefined)?.[k] === "undefined"
  );

  return isT
    ? (value as T)
    : sizeRef[size]
        .map((s) => (value as Dictionary<T> | undefined)?.[s])
        .filter(Boolean)[0];
};

export const getResponsiveValues = <T>(value: Responsive<T>) =>
  normalSizeList
    .map((size) => ({
      size,
      value: getValueForSize<T>({ size, value }),
    }))
    .reduce((pre, val) => {
      (pre as Dictionary<unknown>)[val.size] = val.value;
      return pre;
    }, {} as { [key in NormalSize]: T | undefined });
