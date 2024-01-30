/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
  | Dasher
  | Dancer
  | Prancer
  | Vixen
  | Comet
  | Cupid
  | Donner
  | Blitzen
  | Rudolph;

type Row<T extends number> = [
  [T, 0, 0],
  [T, 0, 1],
  [T, 0, 2],
  [T, 1, 0],
  [T, 1, 1],
  [T, 1, 2],
  [T, 2, 0],
  [T, 2, 1],
  [T, 2, 2]
];
type Column<T extends number> = [
  [0, Div<T, 3>, Mod<T, 3>],
  [1, Div<T, 3>, Mod<T, 3>],
  [2, Div<T, 3>, Mod<T, 3>],
  [3, Div<T, 3>, Mod<T, 3>],
  [4, Div<T, 3>, Mod<T, 3>],
  [5, Div<T, 3>, Mod<T, 3>],
  [6, Div<T, 3>, Mod<T, 3>],
  [7, Div<T, 3>, Mod<T, 3>],
  [8, Div<T, 3>, Mod<T, 3>]
];
type Grid<D extends number, M extends number> = [
  [D, M, 0],
  [D, M, 1],
  [D, M, 2],
  [Add<D, 1>, M, 0],
  [Add<D, 1>, M, 1],
  [Add<D, 1>, M, 2],
  [Add<D, 2>, M, 0],
  [Add<D, 2>, M, 1],
  [Add<D, 2>, M, 2]
];

// type b = Column<0>
// type a = PickFromBoard<
// 	[
// 		//   ^?
// 		[["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
// 		[["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
// 		[["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
// 		[["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
// 		[["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
// 		[["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
// 		[["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["🌩️", "🔴", "⚡"]],
// 		[["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
// 		[["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]],
// 	],
// 	[[0, 0, 0],[1, 0, 0]]
// >;

type ArrayFromLength<
  Length extends number,
  Ret extends unknown[] = []
> = Ret["length"] extends Length
  ? Ret
  : ArrayFromLength<Length, [unknown, ...Ret]>;
// type ArrayFromLength<N extends number, T extends any[] = []> = T['length'] extends N ? T : ArrayFromLength<N, [...T, unknown]>;

type Div<
  A extends number,
  B extends number,
  AList extends unknown[] = ArrayFromLength<A>,
  Tmp extends unknown[] = [],
  Ret extends unknown[] = []
> = AList extends [infer _, ...infer Rest]
  ? Div<
      A,
      B,
      Rest,
      Tmp["length"] extends B ? [unknown] : [unknown, ...Tmp],
      Tmp["length"] extends B ? [unknown, ...Ret] : Ret
    >
  : (Tmp["length"] extends B ? [unknown, ...Ret] : Ret)["length"];

type Mod<
  A extends number,
  B extends number,
  AList extends unknown[] = ArrayFromLength<A>,
  Tmp extends unknown[] = [],
  Ret extends unknown[] = []
> = AList extends [infer _, ...infer Rest]
  ? Div<
      A,
      B,
      Rest,
      Tmp["length"] extends B ? [unknown] : [unknown, ...Tmp],
      Tmp["length"] extends B ? [unknown, ...Ret] : Ret
    >
  : (Tmp["length"] extends B ? [] : Tmp)["length"];

type Add<
  A extends number,
  B extends number,
  AList extends unknown[] = ArrayFromLength<A>,
  BList extends unknown[] = ArrayFromLength<B>
> = [...AList, ...BList]["length"];

type PickFromBoard<
  Boards extends any[][][],
  PosList extends [number, number, number][],
  // Ret extends any[] = [],
  Ret = never
> = PosList extends [
  infer First extends [number, number, number],
  ...infer Rest extends [number, number, number][]
]
  ? // ? PickFromBoard<Boards, Rest, [...Ret,Boards[First[0]][First[1]][First[2]]]>
    PickFromBoard<Boards, Rest, Ret | Boards[First[0]][First[1]][First[2]]>
  : Ret;
type Test<
  Boards extends any[][][],
  PosList extends [number, number, number][]
> = [Reindeer] extends [PickFromBoard<Boards, PosList>] ? true : false;

type TestList<
  Boards extends any[][][],
  PosListList extends [number, number, number][][],
  Ret = never
> = PosListList extends [
  infer First extends [number, number, number][],
  ...infer Rest extends [number, number, number][][]
]
  ? TestList<
      Boards,
      Rest,
      Ret | ([Reindeer] extends [PickFromBoard<Boards, First>] ? true : false)
    >
  : Ret;
type Validate<Boards extends any[][][]> = TestList<
  Boards,
  [
    Row<0>,
    Row<1>,
    Row<2>,
    Row<3>,
    Row<4>,
    Row<5>,
    Row<6>,
    Row<7>,
    Row<8>,
    Column<0>,
    Column<1>,
    Column<2>,
    Column<3>,
    Column<4>,
    Column<5>,
    Column<6>,
    Column<7>,
    Column<8>,
    Grid<0, 0>,
    Grid<0, 1>,
    Grid<0, 2>,
    Grid<3, 0>,
    Grid<3, 1>,
    Grid<3, 2>,
    Grid<6, 0>,
    Grid<6, 1>,
    Grid<6, 2>,
    Grid<6, 6>
  ]
> extends true
  ? true
  : false;
type e = Column<0>;
type Base = [
  //   ^?
  [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
  [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
  [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
  [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
  [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
  [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
  [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["🌩️", "🔴", "⚡"]],
  [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
  [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
];
type Error1 = [
  //   ^?
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
  [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]]
];
type b = PickFromBoard<Error1, Column<0>>;
type a = Test<Error1, Column<0>>;
type B = Column<0>;
type rr = PickFromBoard<Error1, e>;

type j = [Reindeer] extends b ? true : false;

import { Equal, Expect } from "type-testing";

type test_sudoku_1_actual = Validate<
  [
    //   ^?
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
    [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
    [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["🌩️", "🔴", "⚡"]],
    [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
    [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
  ]
>;
type test_sudoku_1 = Expect<Equal<test_sudoku_1_actual, true>>;

type test_sudoku_2_actual = Validate<
  [
    //   ^?
    [["🌩️", "💨", "☄️"], ["🌟", "🦌", "⚡"], ["❤️", "🔴", "💃"]],
    [["🌟", "⚡", "❤️"], ["🔴", "💃", "☄️"], ["🌩️", "💨", "🦌"]],
    [["🔴", "🦌", "💃"], ["💨", "❤️", "🌩️"], ["🌟", "⚡", "☄️"]],
    [["❤️", "☄️", "🌩️"], ["💃", "⚡", "🔴"], ["💨", "🦌", "🌟"]],
    [["🦌", "💃", "⚡"], ["🌩️", "🌟", "💨"], ["🔴", "☄️", "❤️"]],
    [["💨", "🌟", "🔴"], ["🦌", "☄️", "❤️"], ["⚡", "💃", "🌩️"]],
    [["☄️", "🔴", "💨"], ["❤️", "🌩️", "🦌"], ["💃", "🌟", "⚡"]],
    [["💃", "❤️", "🦌"], ["⚡", "🔴", "🌟"], ["☄️", "🌩️", "💨"]],
    [["⚡", "🌩️", "🌟"], ["☄️", "💨", "💃"], ["🦌", "❤️", "🔴"]]
  ]
>;
type test_sudoku_2 = Expect<Equal<test_sudoku_2_actual, true>>;

type test_sudoku_3_actual = Validate<
  [
    //   ^?
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🌟", "⚡", "💨"], ["❤️", "💃", "🔴"], ["☄️", "🌩️", "🦌"]],
    [["☄️", "🌩️", "❤️"], ["⚡", "🌟", "🦌"], ["💃", "🔴", "💨"]],
    [["🌩️", "💃", "🔴"], ["🦌", "💨", "⚡"], ["🌟", "☄️", "❤️"]],
    [["❤️", "☄️", "⚡"], ["💃", "🌩️", "🌟"], ["🦌", "💨", "🔴"]],
    [["💨", "🌟", "🦌"], ["☄️", "🔴", "❤️"], ["🌩️", "💃", "⚡"]],
    [["💃", "💨", "🌟"], ["🔴", "🦌", "☄️"], ["❤️", "⚡", "🌩️"]],
    [["🔴", "❤️", "☄️"], ["🌟", "⚡", "🌩️"], ["💨", "🦌", "💃"]],
    [["⚡", "🦌", "🌩️"], ["💨", "❤️", "💃"], ["🔴", "🌟", "☄️"]]
  ]
>;
type test_sudoku_3 = Expect<Equal<test_sudoku_3_actual, true>>;

type test_sudoku_4_actual = Validate<
  [
    //   ^?
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"], ["🔴", "🌩️", "🌟"]],
    [["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"], ["⚡", "☄️", "❤️"]],
    [["⚡", "☄️", "❤️"], ["🌩️", "🔴", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"], ["⚡", "🔴", "🌟"]],
    [["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"], ["❤️", "🌟", "☄️"]],
    [["❤️", "🌟", "☄️"], ["🔴", "🌩️", "⚡"], ["💃", "🦌", "💨"]]
  ]
>;
type test_sudoku_4 = Expect<Equal<test_sudoku_4_actual, false>>;

type test_sudoku_5_actual = Validate<
  [
    //   ^?
    [["🌩️", "💨", "☄️"], ["🌟", "🦌", "⚡"], ["❤️", "🔴", "💃"]],
    [["🌟", "⚡", "❤️"], ["🔴", "💃", "☄️"], ["🌩️", "💨", "🦌"]],
    [["🔴", "🦌", "💃"], ["💨", "❤️", "🌩️"], ["🌟", "⚡", "☄️"]],
    [["❤️", "☄️", "🌩️"], ["💃", "⚡", "🔴"], ["💨", "🦌", "🌟"]],
    [["🦌", "💃", "⚡"], ["🌩️", "🌟", "💨"], ["🔴", "☄️", "❤️"]],
    [["💨", "🌟", "🔴"], ["🦌", "☄️", "❤️"], ["⚡", "💃", "🌩️"]],
    [["☄️", "🔴", "💨"], ["❤️", "💃", "🦌"], ["💃", "🌟", "⚡"]],
    [["💃", "❤️", "🦌"], ["⚡", "🔴", "🌟"], ["☄️", "🌩️", "💨"]],
    [["⚡", "🌩️", "🌟"], ["☄️", "💨", "💃"], ["🦌", "❤️", "🔴"]]
  ]
>;
type test_sudoku_5 = Expect<Equal<test_sudoku_5_actual, false>>;

type test_sudoku_6_actual = Validate<
  [
    //   ^?
    [["⚡", "🔴", "🌩️"], ["🦌", "❤️", "💨"], ["💨", "🌟", "☄️"]],
    [["❤️", "🦌", "🌟"], ["💨", "🌟", "🔴"], ["💃", "⚡", "🌩️"]],
    [["💨", "💃", "🌟"], ["☄️", "⚡", "🌩️"], ["🔴", "❤️", "🦌"]],
    [["🦌", "⚡", "🔴"], ["❤️", "💃", "💨"], ["☄️", "🌩️", "🌟"]],
    [["🌟", "🌩️", "💃"], ["⚡", "🔴", "☄️"], ["❤️", "🦌", "💨"]],
    [["☄️", "💨", "❤️"], ["🌟", "🌩️", "🦌"], ["⚡", "💃", "🔴"]],
    [["🌩️", "☄️", "💨"], ["💃", "🦌", "⚡"], ["🌟", "🔴", "❤️"]],
    [["🔴", "❤️", "⚡"], ["🌩️", "☄️", "🌟"], ["🦌", "💨", "💃"]],
    [["💃", "🌟", "🦌"], ["🔴", "💨", "❤️"], ["🌩️", "☄️", "⚡"]]
  ]
>;
type test_sudoku_6 = Expect<Equal<test_sudoku_6_actual, false>>;

type test_sudoku_7_actual = Validate<
  [
    [["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"]],
    [["💃", "🦌", "☄️"], ["❤️", "🌩️", "🌟"], ["⚡", "🔴", "💨"]],
    [["🦌", "☄️", "❤️"], ["🌩️", "🌟", "⚡"], ["🔴", "💨", "💃"]],
    [["☄️", "❤️", "🌩️"], ["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"]],
    [["❤️", "🌩️", "🌟"], ["⚡", "🔴", "💨"], ["💃", "🦌", "☄️"]],
    [["🌩️", "🌟", "⚡"], ["🔴", "💨", "💃"], ["🦌", "☄️", "❤️"]],
    [["🌟", "⚡", "🔴"], ["💨", "💃", "🦌"], ["☄️", "❤️", "🌩️"]],
    [["⚡", "🔴", "💨"], ["💃", "🦌", "☄️"], ["❤️", "🌩️", "🌟"]],
    [["🔴", "💨", "💃"], ["🦌", "☄️", "❤️"], ["🌩️", "🌟", "⚡"]]
  ]
>;

type test_sudoku_7 = Expect<Equal<test_sudoku_7_actual, false>>;

type test_sudoku_8_actual = Validate<
  [
    //   ^?
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]],
    [["🦌", "🔴", "💃"], ["🌩️", "☄️", "💨"], ["⚡", "❤️", "🌟"]]
  ]
>;

type test_sudoku_8 = Expect<Equal<test_sudoku_8_actual, false>>;
