type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type ArrayFromLength<
  Length extends number,
  Ret extends unknown[] = []
> = Ret["length"] extends Length
  ? Ret
  : ArrayFromLength<Length, [unknown, ...Ret]>;
type Add<
  A extends number,
  B extends number,
  AList extends unknown[] = ArrayFromLength<A>,
  BList extends unknown[] = ArrayFromLength<B>,
  Ret extends unknown[] = []
> = BList extends [infer _, ...infer RestB]
  ? Add<A, B, AList, RestB, [unknown, ...Ret]>
  : AList extends [infer _, ...infer RestA]
  ? Add<A, B, RestA, BList, [unknown, ...Ret]>
  : Ret["length"];
type Sub<
  A extends number,
  B extends number,
  AList extends unknown[] = ArrayFromLength<A>,
  BList extends unknown[] = ArrayFromLength<B>
> = BList extends [infer _, ...infer RestB]
  ? AList extends [infer _, ...infer RestA]
    ? Sub<A, B, RestA, RestB>
    : never
  : AList["length"];

type PickSantaFromBoard<
  Board extends any[][],
  Item = "🎅",
  RowIndex extends unknown[] = []
> = Board extends [infer First extends any[], ...infer Rest extends any[][]]
  ? [PickSantaFromRow<First, Item>] extends [never]
    ? PickSantaFromBoard<Rest, Item, [unknown, ...RowIndex]>
    : [RowIndex["length"], PickSantaFromRow<First, Item>]
  : never;
type PickSantaFromRow<
  Row extends any[],
  Item = "🎅",
  ColumnIndex extends unknown[] = []
> = Row extends [infer First, ...infer Rest]
  ? First extends Item
    ? ColumnIndex["length"]
    : PickSantaFromRow<Rest, Item, [unknown, ...ColumnIndex]>
  : never;

type Up<Pos extends [number, number]> = [Sub<Pos[0], 1>, Pos[1]];
type Down<Pos extends [number, number]> = [Add<Pos[0], 1>, Pos[1]];
type Left<Pos extends [number, number]> = [Pos[0], Sub<Pos[1], 1>];
type Right<Pos extends [number, number]> = [Pos[0], Add<Pos[1], 1>];

type MoveAction<
  Pos extends [number, number],
  Sort extends Directions
> = Sort extends "up"
  ? Up<Pos>
  : Sort extends "down"
  ? Down<Pos>
  : Sort extends "left"
  ? Left<Pos>
  : Sort extends "right"
  ? Right<Pos>
  : [-1, -1];

type Move<Board extends any[][], Sort extends Directions> = EndList<
  Board,
  Sort
> extends MazeWin
  ? MazeWin
  : StepBoard<Board, Sort>;

type StepBoard<
  Board extends any[][],
  Sort extends Directions,
  Ret extends any[][] = [],
  Origin extends [number, number] = PickSantaFromBoard<Board>,
  Target extends [number, number] = MoveAction<Origin, Sort>,
  OriginBoard extends any[][] = Board,
  RowIndex extends unknown[] = []

  // > =  Target;
> = OriginBoard[Target[0]][Target[1]] extends Alley
  ? Board extends [infer First extends any[], ...infer Rest extends any[][]]
    ? StepBoard<
        Rest,
        Sort,
        [...Ret, StepRow<First, Origin, Target, OriginBoard, RowIndex>],
        // [...Ret, First],

        // [...Ret,[unknown]],

        Origin,
        Target,
        OriginBoard,
        [unknown, ...RowIndex]
      >
    : Ret
  : Board;

type StepRow<
  Row extends any[],
  Origin extends [number, number],
  Target extends [number, number],
  Board extends any[][],
  RowIndex extends unknown[],
  ColumnIndex extends unknown[] = [],
  Ret extends any[] = []
> = Row extends [infer First, ...infer Rest]
  ? StepRow<
      Rest,
      Origin,
      Target,
      Board,
      RowIndex,
      [unknown, ...ColumnIndex],
      [
        ...Ret,
        [RowIndex["length"], ColumnIndex["length"]] extends Origin
          ? Alley
          : // :[RowIndex["length"], ColumnIndex["length"]]
          [RowIndex["length"], ColumnIndex["length"]] extends Target
          ? "🎅"
          : First
      ]
    >
  : Ret;
type sdd = StepRow<
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  [0, 6],
  [1, 6],
  [
    ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎅", "🎄", "🎄", "🎄"],
    ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"]
  ],
  [unknown]
>;

type ad = StepBoard<
  [
    ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
    ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎅", "🎄", "🎄", "🎄"]
  ],
  "up"
>;
type EndUp<
  Board extends any[][],
  Flag extends Directions,
  Origin extends [number, number] = PickSantaFromBoard<Board>,
  Target extends [number, number] = MoveAction<Origin, Flag>
> = Board extends MazeWin
  ? Board
  : Origin[0] extends 0
  ? Flag extends "up"
    ? MazeWin
    : Board
  : Board;
type EndDown<
  Board extends any[][],
  Flag extends Directions,
  Origin extends [number, number] = PickSantaFromBoard<Board>,
  Target extends [number, number] = MoveAction<Origin, Flag>
> = Board extends MazeWin
  ? Board
  : Target[0] extends Board["length"]
  ? Flag extends "down"
    ? MazeWin
    : Board
  : Board;
type EndLeft<
  Board extends any[][],
  Flag extends Directions,
  Origin extends [number, number] = PickSantaFromBoard<Board>,
  Target extends [number, number] = MoveAction<Origin, Flag>
  // > = Origin[1];
> = Board extends MazeWin
  ? Board
  : Origin[1] extends 0
  ? Flag extends "left"
    ? MazeWin
    : Board
  : Board;

type EndRight<
  Board extends any[][],
  Flag extends Directions,
  Origin extends [number, number] = PickSantaFromBoard<Board>,
  Target extends [number, number] = MoveAction<Origin, Flag>
> = Board extends MazeWin
  ? Board
  : Target[1] extends Board[0]["length"]
  ? Flag extends "right"
    ? MazeWin
    : Board
  : Board;

type EndList<Board extends any[][], Flag extends Directions> = EndUp<
  EndDown<EndLeft<EndRight<Board, Flag>, Flag>, Flag>,
  Flag
>;
import { Expect, Equal } from "type-testing";

type Maze0 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎅", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];

// can't move up!
type test_maze0_up_actual = Move<Maze0, "up">;
//   ^?
type test_maze0_up = Expect<Equal<test_maze0_up_actual, Maze0>>;

// but Santa can move down!
type test_maze0_down_actual = Move<Maze0, "down">;
//   ^?
type Maze1 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎅", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze0_down = Expect<Equal<test_maze0_down_actual, Maze1>>;

// Santa can move down again!
type test_maze1_down_actual = Move<Maze1, "down">;
type Maze2 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎅", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze1_down = Expect<Equal<test_maze1_down_actual, Maze2>>;

// can't move left!
type test_maze2_left_actual = Move<Maze2, "left">;
//   ^?
type test_maze2_left = Expect<Equal<test_maze2_left_actual, Maze2>>;

// if Santa moves up, it's back to Maze1!
type test_maze2_up_actual = Move<Maze2, "up">;
//   ^?
type test_maze2_up = Expect<Equal<test_maze2_up_actual, Maze1>>;

// can't move right!
type test_maze2_right_actual = Move<Maze2, "right">;
//   ^?
type test_maze2_right = Expect<Equal<test_maze2_right_actual, Maze2>>;

// we exhausted all other options! guess we gotta go down!
type test_maze2_down_actual = Move<Maze2, "down">;
//   ^?
type Maze3 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "🎅", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze2_down = Expect<Equal<test_maze2_down_actual, Maze3>>;

// maybe we just gotta go down all the time?
type test_maze3_down_actual = Move<Maze3, "down">;
//   ^?
type Maze4 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "🎅", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze3_down = Expect<Equal<test_maze3_down_actual, Maze4>>;

// let's go left this time just to change it up?
type test_maze4_left_actual = Move<Maze4, "left">;
//   ^?
type Maze5 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "🎅", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
// it worked!
type test_maze4_left = Expect<Equal<test_maze4_left_actual, Maze5>>;

// couldn't hurt to try left again?
type test_maze5_left_actual = Move<Maze5, "left">;
//   ^?
type Maze6 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "🎅", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze5_left = Expect<Equal<test_maze5_left_actual, Maze6>>;

// three time's a charm?
type test_maze6_left_actual = Move<Maze6, "left">;
//   ^?
// lol, nope.
type test_maze6_left = Expect<Equal<test_maze6_left_actual, Maze6>>;

// we haven't tried up yet (?)
type test_maze6_up_actual = Move<Maze6, "up">;
//   ^?
type Maze7 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "🎅", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
// NOICE.
type test_maze6_up = Expect<Equal<test_maze6_up_actual, Maze7>>;

// maybe another left??
type test_maze7_left_actual = Move<Maze7, "left">;
//   ^?
type Maze8 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "🎅", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze7_left = Expect<Equal<test_maze7_left_actual, Maze8>>;

// haven't tried a right yet.. let's give it a go!
type test_maze7_right_actual = Move<Maze8, "right">;
//   ^?
// not this time...
type test_maze7_right = Expect<Equal<test_maze7_right_actual, Maze7>>;

// probably just need to stick with left then
type test_maze8_left_actual = Move<Maze8, "left">;
//   ^?
type Maze9 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "🎅", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze8_left = Expect<Equal<test_maze8_left_actual, Maze9>>;

// why fix what's not broken?
type test_maze9_left_actual = Move<Maze9, "left">;
//   ^?
type Maze10 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "🎅", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze9_left = Expect<Equal<test_maze9_left_actual, Maze10>>;

// do you smell cookies?? it's coming from down..
type test_maze10_down_actual = Move<Maze10, "down">;
//   ^?
type Maze11 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "🎅", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze10_down = Expect<Equal<test_maze10_down_actual, Maze11>>;

// the cookies must be freshly baked.  I hope there's also the customary glass of milk!
type test_maze11_left_actual = Move<Maze11, "left">;
//   ^?
type Maze12 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎅", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"]
];
type test_maze11_left = Expect<Equal<test_maze11_left_actual, Maze12>>;

// COOKIES!!!!!
type test_maze12_left_actual = Move<Maze12, "left">;
//   ^?
type MazeWin = [
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"]
];
type test_maze12_left = Expect<Equal<test_maze12_left_actual, MazeWin>>;
