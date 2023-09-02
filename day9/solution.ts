import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { RopeState, Vector } from "./types";
import { decodeMove, splitMoveToSingleSteps } from "./utils.js";
import { drawRope } from "./visualization.js";
import { moveRope } from "./logic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, "input_data");

const part =
  process.argv.find((arg) => arg === "--part_one" || arg === "--part_two") ??
  "--part_one";
const partKey = part.replace("--", "");

const withVisualisation = process.argv.indexOf("--visualize") > -1;

const startPoint: Vector = {
  x: 0,
  y: 0,
};

const initialState: Record<string, RopeState> = {
  part_one: {
    head: startPoint,
    tail: [startPoint],
  },
  part_two: {
    head: startPoint,
    tail: [
      startPoint,
      startPoint,
      startPoint,
      startPoint,
      startPoint,
      startPoint,
      startPoint,
      startPoint,
      startPoint,
    ],
  },
};

const steps = fs
  .readFileSync(filePath, { encoding: "utf8" })
  .split("\n")
  .map(decodeMove)
  .flatMap(splitMoveToSingleSteps);

const finalState = moveRope(initialState[partKey], steps, withVisualisation);

if (withVisualisation) {
  setTimeout(() => {
    drawRope(finalState);
    console.log("final state", [finalState.head, ...finalState.tail]);
    console.log("Number of visited fields", finalState.tailVisitedFieldsNumber);
  }, steps.length * 300);
} else {
  console.log("final state", [finalState.head, ...finalState.tail]);
  console.log("Number of visited fields", finalState.tailVisitedFieldsNumber);
}
