/*
--- Part Two ---
It seems like there is still quite a bit of duplicate work planned. Instead, the Elves would like to know the number of pairs that overlap at all.

In the above example, the first two pairs (2-4,6-8 and 2-3,4-5) don't overlap, while the remaining four pairs (5-7,7-9, 2-8,3-7, 6-6,4-6, and 2-6,4-8) do overlap:

5-7,7-9 overlaps in a single section, 7.
2-8,3-7 overlaps all of the sections 3 through 7.
6-6,4-6 overlaps in a single section, 6.
2-6,4-8 overlaps in sections 4, 5, and 6.
So, in this example, the number of overlapping assignment pairs is 4.

In how many assignment pairs do the ranges overlap?
*/

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.resolve(__dirname, "input_data"), {
  encoding: "utf8",
});

const result = data.split("\n").reduce((numOfOverlappingPairs, line) => {
  const [A, B, C, D] = line.split(/,|-/).map((str) => parseInt(str, 10));

  if (
    (C >= A && C <= B) ||
    (D >= A && D <= B) ||
    (A >= C && A <= D) ||
    (B >= C && B <= D)
  ) {
    return numOfOverlappingPairs + 1;
  }

  return numOfOverlappingPairs;
}, 0);

console.log(result);
