type DayCounter<From, To> = Calc<ArrayFromNumber<From>, ArrayFromNumber<To>>;
type Calc<A extends unknown[], B extends unknown[], R = never> = A["length"] extends B["length"]
	? R | A["length"]
	: Calc<[unknown, ...A], B, R | A["length"]>;
type ArrayFromNumber<L, R extends unknown[] = []> = L extends R["length"]
	? R
	: ArrayFromNumber<L, [unknown, ...R]>;

import { Expect, Equal } from 'type-testing';

type TwelveDaysOfChristmas = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type test_0_actual = DayCounter<1, 12>;
//   ^?
type test_0_expected = TwelveDaysOfChristmas;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type DaysUntilChristmas =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25;
type test_1_actual = DayCounter<1, 25>;
//   ^?
type test_1_expected = DaysUntilChristmas;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;