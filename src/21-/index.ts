type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

type YIndex = {
  top: 0;
  middle: 1;
  bottom: 2;
};
type XIndex = {
  left: 0;
  center: 1;
  right: 2;
};

type TicTacToe<
  Game extends { board: any[][]; state: "❌" | "⭕" },
  S extends string
> = S extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
  ? Game["board"][YIndex[Y]][XIndex[X]] extends "  "
    ? NoSpaceEnd<
        EndList<
          {
            state: "❌" extends Game["state"] ? "⭕" : "❌";
            // board: StepBoard<Game["board"], XIndex[X], YIndex[Y], Game["state"]>;
            board: StepBoard<
              Game["board"],
              YIndex[Y],
              XIndex[X],
              Game["state"]
            >;
            // board:  [XIndex[X], YIndex[Y]]
          },
          [
            RowEndPoint<0>,
            RowEndPoint<1>,
            RowEndPoint<2>,
            ColumnEndPoint<0>,
            ColumnEndPoint<1>,
            ColumnEndPoint<2>,
            ...SpecialEndPoint
          ]
          // [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[0, 1], [1, 1], [2, 1]]]
        >
      >
    : Game
  : never;
type StepBoard<
  Board extends any[][],
  X extends number,
  Y extends number,
  State,
  RowIndex extends unknown[] = [],
  Ret extends any[][] = []
> = Board extends [infer First extends any[], ...infer Rest extends any[][]]
  ? StepBoard<
      Rest,
      X,
      Y,
      State,
      [unknown, ...RowIndex],
      [...Ret, StepRow<First, X, Y, State, RowIndex>]
    >
  : Ret;

type StepRow<
  Row extends any[],
  X extends number,
  Y extends number,
  State,
  RowIndex extends unknown[],
  ColumnIndex extends unknown[] = [],
  Ret extends any[] = []
> = X extends RowIndex["length"]
  ? Row extends [infer First, ...infer Rest]
    ? StepRow<
        Rest,
        X,
        Y,
        State,
        RowIndex,
        [unknown, ...ColumnIndex],
        [
          ...Ret,
          ColumnIndex["length"] extends Y
            ? First extends "  "
              ? State
              : First
            : First
        ]
      >
    : Ret
  : Row;

type a = StepRow<["0", "1", "2"], 0, 1, "JACK", []>;

type End<
  Game extends { board: any[][]; state: string },
  P0 extends [number, number],
  P1 extends [number, number],
  P2 extends [number, number],
  Board extends any[][] = Game["board"]
> = Game["state"] extends "❌" | "⭕"
  ? Board[P0[0]][P0[1]] extends "❌" | "⭕"
    ? Board[P0[0]][P0[1]] extends Board[P1[0]][P1[1]]
      ? Board[P0[0]][P0[1]] extends Board[P2[0]][P2[1]]
        ? {
            board: Game["board"];
            state: `${Game["state"] extends "❌" ? "⭕" : "❌"} Won`;
          }
        : Game
      : Game
    : Game
  : Game;

type EndList<
  Game extends { board: any[][]; state: string },
  List
> = List extends [
  infer P extends [[number, number], [number, number], [number, number]],
  ...infer Rest
]
  ? EndList<End<Game, P[0], P[1], P[2]>, Rest>
  : Game;

type RowEndPoint<Row extends number> = [[Row, 0], [Row, 1], [Row, 2]];
type ColumnEndPoint<Column extends number> = [
  [0, Column],
  [1, Column],
  [2, Column]
];
type SpecialEndPoint = [[[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];
type NoSpaceEnd<Game extends { board: any[][]; state: string }> =
  Game["state"] extends "⭕ Won" | "❌ Won"
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
type NoRowSpace<Row extends any[], Ret = never> = Row extends [
  infer First,
  ...infer Rest extends any[]
]
  ? First extends "❌" | "⭕"
    ? NoRowSpace<Rest>
    : false
  : true;
// type NoSpace<Board extends any[][]> = Board[number];
// type NoRowSpace<Row extends any[]> = "❌" | "⭕" extends Row[number] ? true : false;
type b = NoRowSpace<["❌"]>;
type c = NoSpace<[["❌"], ["⭕"]]>;
// type d = NoRowSpace<["❌", "⭕"] | ["❌", " "]>

import { Equal, Expect } from "type-testing";

type test_move1_actual = TicTacToe<NewGame, "top-center">;
//   ^?
type test_move1_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, "top-left">;
//   ^?
type test_move2_expected = {
  board: [["⭕", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "❌";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, "middle-center">;
//   ^?
type test_move3_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, "bottom-left">;
//   ^?
type test_move4_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "  "]];
  state: "❌";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, "bottom-center">;
//   ^?
type test_x_win_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "❌", "  "]];
  state: "❌ Won";
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, "bottom-right">;
//   ^?
type type_move5_expected = {
  board: [["⭕", "❌", "  "], ["  ", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕";
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, "middle-left">;
//   ^?
type test_o_win_expected = {
  board: [["⭕", "❌", "  "], ["⭕", "❌", "  "], ["⭕", "  ", "❌"]];
  state: "⭕ Won";
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, "top-center">;
//   ^?
type test_invalid_expected = {
  board: [["  ", "❌", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];
  state: "⭕";
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "  "]];
  state: "⭕";
};
type test_draw_actual = TicTacToe<test_before_draw, "bottom-right">;
//   ^?
type test_draw_expected = {
  board: [["⭕", "❌", "⭕"], ["⭕", "❌", "❌"], ["❌", "⭕", "⭕"]];
  state: "Draw";
};
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
