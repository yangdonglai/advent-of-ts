type Store = ["🛹", "🚲", "🛴", "🏄"];
type ArrayFill<Item, Count, R extends any[] = []> = R["length"] extends Count
  ? R
  : ArrayFill<Item, Count, [Item, ...R]>;
type Fill<
  Index extends unknown[],
  First extends number
> = Index["length"] extends Store["length"]
  ? ArrayFill<Store[0], First>
  : ArrayFill<Store[Index["length"]], First>;
type Rebuild<
  List extends number[],
  Ret extends any[] = [],
  Index extends unknown[] = []
> = List extends [infer First extends number, ...infer Rest extends number[]]
  ? Rebuild<
      Rest,
      [...Ret, ...Fill<Index, First>],
      Index["length"] extends Store["length"] ? [unknown] : [unknown, ...Index]
    >
  : Ret;


import { Expect, Equal } from "type-testing";

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
type test_0_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴"
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
type test_1_expected = [
  "🛹",
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🏄",
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴"
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
type test_2_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴"
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
