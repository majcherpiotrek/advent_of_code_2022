/*
--- Part Two ---
The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"

The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:

In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.resolve(__dirname, "./input_data"), {
  encoding: "utf8",
});

type Move = "A" | "B" | "C"; // Rock, Paper, Scissors
type RequiredResult = "X" | "Y" | "Z"; // Lose, Draw, Win

const pointsForMove: Record<Move, number> = {
  A: 1,
  B: 2,
  C: 3,
};

const pointsForResult: Record<RequiredResult, number> = {
  X: 0,
  Y: 3,
  Z: 6,
};

const movesToMake: Record<Move, Record<RequiredResult, Move>> = {
  A: {
    // Rock
    X: "C", // Scissors to lose
    Y: "A", // Rock to draw
    Z: "B", // Paper to win
  },
  B: {
    // Paper
    X: "A", // Rock to loose
    Y: "B", // Paper to draw
    Z: "C", //  Scissors to win
  },
  C: {
    // Scissors
    X: "B", // Paper to loos
    Y: "C", // Scissors to draw
    Z: "A", // Rock to win
  },
};

const result = data.split("\n").reduce<number>((acc, roundStr) => {
  const [move, requiredResult] = roundStr.split(" ");
  const moveToRespond: Move | null =
    movesToMake[move as Move][requiredResult as RequiredResult] ?? null;

  return moveToRespond
    ? acc +
        pointsForMove[moveToRespond] +
        pointsForResult[requiredResult as RequiredResult]
    : acc;
}, 0);

console.log("Result", result);
