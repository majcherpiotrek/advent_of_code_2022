import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { averageTimeAsync, averageTimeSync } from "../profiling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function withReduce() {
  const data = fs.readFileSync(path.resolve(__dirname, "./input_data"), {
    encoding: "utf8",
  });
  return data.split("\n\n").reduce(
    (acc, elvesCaloriesStr, index) => {
      const calories = elvesCaloriesStr
        .split("\n")
        .reduce((totalCalories, itemCaloriesStr) => {
          const calories = parseInt(itemCaloriesStr, 10);
          return Number.isNaN(calories)
            ? totalCalories
            : totalCalories + calories;
        }, 0);

      return calories > acc.calories ? { index, calories } : acc;
    },
    { index: -1, calories: 0 },
  );
}

async function withStreamAndReadline() {
  const readStream = fs.createReadStream(
    path.resolve(__dirname, "./input_data"),
  );
  const rl = readline.createInterface(readStream);

  let elfIndex = 0;
  let prevLine: number | null = null;
  let currentElf = { index: 0, calories: 0 };
  const winningElf = Object.assign({}, currentElf);

  for await (const line of rl) {
    const thisLine = parseInt(line);
    if (isNaN(thisLine) && prevLine !== null && !isNaN(prevLine)) {
      if (currentElf.calories > winningElf.calories) {
        winningElf.calories = currentElf.calories;
        winningElf.index = currentElf.index;
      }

      currentElf = {
        index: ++elfIndex,
        calories: 0,
      };
    } else if (!isNaN(thisLine)) {
      currentElf.calories += thisLine;
    }
    prevLine = thisLine;
  }

  return winningElf;
}

const result = withReduce();
const avgTime = averageTimeSync(1000, withReduce);
console.log("Result using reduce:", result);
console.log("Avg time using reduce:", avgTime);

const result2 = await withStreamAndReadline();
const avgTime2 = await averageTimeAsync(1000, withStreamAndReadline);
console.log("Result using readline:", result2);
console.log("Avg time using readline:", avgTime2);
