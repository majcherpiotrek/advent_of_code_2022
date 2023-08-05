import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";
import { averageTimeAsync, averageTimeSync } from "../profiling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findTopN(n: number) {
  const data = fs.readFileSync(path.resolve(__dirname, "./input_data"), {
    encoding: "utf8",
  });
  const initialTopNCalories = Array.apply(0, Array(n)).map(() => 0);
  return data.split("\n\n").reduce<number[]>((acc, elvesCaloriesStr) => {
    const calories = elvesCaloriesStr
      .split("\n")
      .reduce((totalCalories, itemCaloriesStr) => {
        const calories = parseInt(itemCaloriesStr, 10);
        return Number.isNaN(calories)
          ? totalCalories
          : totalCalories + calories;
      }, 0);

    acc.push(calories);
    return acc.sort((a, b) => b - a).slice(0, n);
  }, initialTopNCalories);
}

const result = findTopN(3);
const avgTime = averageTimeSync(1000, () => findTopN(3));
console.log("Result:", result);
console.log(
  "Sum:",
  result.reduce((a, b) => a + b),
);
console.log("Avg time:", avgTime);
