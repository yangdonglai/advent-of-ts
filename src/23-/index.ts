type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "]
];
type Board1 = [
  ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "  "],
  ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
  ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
  ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
  ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
  ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"]
];

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
  BList extends unknown[] = ArrayFromLength<B>
> = [...AList, ...BList]["length"];
type Horizontal<X extends number, Y extends number> = [
  [X, Y],
  [X, Add<Y, 1>],
  [X, Add<Y, 2>],
  [X, Add<Y, 3>]
];
type Vertical<X extends number, Y extends number> = [
  [X, Y],
  [Add<X, 1>, Y],
  [Add<X, 2>, Y],
  [Add<X, 3>, Y]
];
type Diagonal1<X extends number, Y extends number> = [
  [X, Y],
  [Add<X, 1>, Add<Y, 1>],
  [Add<X, 2>, Add<Y, 2>],
  [Add<X, 3>, Add<Y, 3>]
];
type Diagonal2<X extends number, Y extends number> = [
  [Add<X, 3>, Y],
  [Add<X, 2>, Add<Y, 1>],
  [Add<X, 1>, Add<Y, 2>],
  [X, Add<Y, 3>]
];
type PickFromBoard<
  Boards extends any[][],
  PosList extends [number, number][],
  Ret extends any[] = []
  // Ret = never
> = PosList extends [
  infer First extends [number, number],
  ...infer Rest extends [number, number][]
]
  ? PickFromBoard<Boards, Rest, [...Ret, Boards[First[1]][First[0]]]>
  : // ? PickFromBoard<Boards, Rest, Ret | Boards[First[1]][First[0]]>
    Ret;

type StepBoard<
  Board extends any[][],
  Pos extends number,
  Pawns,
  Flag = true,
  Ret extends any[][] = []
> = Board extends [...infer Rest extends any[][], infer Last extends any[]]
  ? StepBoard<
      Rest,
      Pos,
      Pawns,
      Last[Pos] extends "  " ? false : true,
      [
        Flag extends true
          ? Last[Pos] extends "  "
            ? StepRow<Last, Pos, Pawns>
            : Last
          : Last,
        ...Ret
      ]
    >
  : Ret;
// Last:Ret;
type StepRow<
  Row extends any[],
  Pos extends number,
  Pawns,
  ColumnIndex extends unknown[] = [],
  Ret extends any[] = []
> = Row extends [infer First, ...infer Rest]
  ? StepRow<
      Rest,
      Pos,
      Pawns,
      [unknown, ...ColumnIndex],
      [
        ...Ret,
        ColumnIndex["length"] extends Pos
          ? First extends "  "
            ? Pawns
            : First
          : First
      ]
    >
  : Ret;

type aaa = StepRow<["  ", "  ", "  "], 1, "🟡">;
type ccc = StepBoard<
  [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "🟡", "  "]],
  0,
  "🟡"
>;
type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type a = PickFromBoard<Board1, Horizontal<6, 3>>;
type b = PickFromBoard<Board1, Vertical<0, 0>>;
type c = PickFromBoard<Board1, Diagonal1<0, 0>>;
type d = PickFromBoard<Board1, Diagonal2<0, 1>>;
type e = Connect4<NewGame, 0>;
type f = Connect4<e, 0>;

type GetStateFromList<List extends any[]> = List extends [
  "🔴",
  "🔴",
  "🔴",
  "🔴"
]
  ? "🔴 Won"
  : List extends ["🟡", "🟡", "🟡", "🟡"]
  ? "🟡 Won"
  : never;
type NextStep<
  Game extends {
    board: any[][];
    state: "🟡" | "🔴";
  },
  Pos extends number
> = NoSpaceEnd<
  EndList<
    {
      board: StepBoard<Game["board"], Pos, Game["state"]>;
      state: Game["state"] extends "🔴" ? "🟡" : "🔴";
    },
    [Vertical<0, 4>, Vertical<0, 5>, Diagonal2<0, 2>]
  >
>;

type End<
  Game extends { board: any[][]; state: string },
  PosList extends [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ],
  Board extends any[][] = Game["board"]
> = Game["state"] extends "🔴 Won" | "🟡 Won"
  ? Game
  : {
      board: Board;
      state: [GetStateFromList<PickFromBoard<Board, PosList>>] extends [never]
        ? Game["state"]
        : GetStateFromList<PickFromBoard<Board, PosList>>;
    };

type EndList<
  Game extends { board: any[][]; state: string },
  List
> = List extends [
  infer P extends [
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ],
  ...infer Rest
]
  ? EndList<End<Game, P>, Rest>
  : Game;

type NoSpaceEnd<Game extends { board: any[][]; state: string }> =
  Game["state"] extends "🔴 Won" | "🟡 Won"
    ? Game
    : NoSpace<Game["board"]> extends true
    ? {
        board: Game["board"];
        state: "Draw";
      }
    : Game;

type NoSpace<Board extends any[][]> = Board extends [
  infer First extends any[],
  ...infer Rest extends any[]
]
  ? NoRowSpace<First> extends false
    ? false
    : NoSpace<Rest>
  : true;
type NoRowSpace<Row extends any[]> = Row extends [
  infer First,
  ...infer Rest extends any[]
]
  ? First extends "🟡" | "🔴"
    ? NoRowSpace<Rest>
    : false
  : true;

type Connect4<
  Game extends {
    board: any[][];
    state: "🟡" | "🔴";
  },
  Pos extends number
> = NextStep<Game, Pos>;

import { Expect, Equal } from "type-testing";

type test_move1_actual = Connect4<NewGame, 0>;
//   ^?
type test_move1_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🔴";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = Connect4<test_move1_actual, 0>;
//   ^?
type test_move2_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🟡";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = Connect4<test_move2_actual, 0>;
//   ^?
type test_move3_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🔴";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = Connect4<test_move3_actual, 1>;
//   ^?
type test_move4_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "  ", "  ", "  ", "  ", "  "]
  ];
  state: "🟡";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_move5_actual = Connect4<test_move4_actual, 2>;
//   ^?
type test_move5_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "]
  ];
  state: "🔴";
};
type test_move5 = Expect<Equal<test_move5_actual, test_move5_expected>>;

type test_move6_actual = Connect4<test_move5_actual, 1>;
//   ^?
type test_move6_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "]
  ];
  state: "🟡";
};
type test_move6 = Expect<Equal<test_move6_actual, test_move6_expected>>;

type test_red_win_actual = Connect4<
  {
    board: [
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🔴", "🔴", "🔴", "  ", "  ", "  ", "  "],
      ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
    ];
    state: "🔴";
  },
  3
>;

type test_red_win_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "🔴", "🔴", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
  ];
  state: "🔴 Won";
};

type test_red_win = Expect<Equal<test_red_win_actual, test_red_win_expected>>;

type test_yellow_win_actual = Connect4<
  {
    board: [
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
      ["🔴", "  ", "🔴", "🔴", "  ", "  ", "  "],
      ["🟡", "  ", "🟡", "🟡", "  ", "  ", "  "]
    ];
    state: "🟡";
  },
  1
>;

type test_yellow_win_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "🔴", "🔴", "  ", "  ", "  "],
    ["🟡", "🟡", "🟡", "🟡", "  ", "  ", "  "]
  ];
  state: "🟡 Won";
};

type test_yellow_win = Expect<
  Equal<test_yellow_win_actual, test_yellow_win_expected>
>;

type test_diagonal_yellow_win_actual = Connect4<
  {
    board: [
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
      ["  ", "  ", "🟡", "🔴", "  ", "  ", "  "],
      ["🔴", "🟡", "🔴", "🔴", "  ", "  ", "  "],
      ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
    ];
    state: "🟡";
  },
  3
>;

type test_diagonal_yellow_win_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "🟡", "  ", "  ", "  "],
    ["  ", "  ", "🟡", "🔴", "  ", "  ", "  "],
    ["🔴", "🟡", "🔴", "🔴", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "🟡", "  ", "  ", "  "]
  ];
  state: "🟡 Won";
};

type test_diagonal_yellow_win = Expect<
  Equal<test_diagonal_yellow_win_actual, test_diagonal_yellow_win_expected>
>;

type test_draw_actual = Connect4<
  {
    board: [
      ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "  "],
      ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
      ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
      ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
      ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
      ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"]
    ];
    state: "🟡";
  },
  6
>;

type test_draw_expected = {
  board: [
    ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
    ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
    ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
    ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"],
    ["🟡", "🔴", "🔴", "🟡", "🟡", "🔴", "🟡"],
    ["🔴", "🟡", "🟡", "🔴", "🔴", "🟡", "🔴"]
  ];
  state: "Draw";
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
