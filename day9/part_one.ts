import fs from "fs";
import path from "path";
import { argv } from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, "input_data");

const withVisualisation = argv[2] === "--visualize";

const data = fs.readFileSync(filePath, { encoding: "utf8" });

type Vector = [x: number, y: number];

function decodeMove(row: string): Vector {
  const [direction, distanceStr] = row.split(" ");

  const distance = parseInt(distanceStr);

  if (Number.isNaN(distanceStr)) {
    return [0, 0];
  }

  switch (direction) {
    case "R":
      return [distance, 0];
    case "L":
      return [-1 * distance, 0];
    case "U":
      return [0, distance];
    case "D":
      return [0, -1 * distance];
    default:
      return [0, 0];
  }
}

function addVectors(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1]];
}

function subtractVectors(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1]];
}

type SingleMove = [1, 0] | [-1, 0] | [0, 1] | [0, -1];

function splitMoveToSingleSteps(move: Vector): SingleMove[] {
  const xMoves = Array.apply(null, Array(Math.abs(move[0]))).map(
    () => [move[0] > 0 ? 1 : -1, 0] satisfies SingleMove,
  );
  const yMoves = Array.apply(null, Array(Math.abs(move[1]))).map(
    () => [0, move[1] > 0 ? 1 : -1] satisfies SingleMove,
  );
  return [...xMoves, ...yMoves];
}

type State = {
  head: Vector;
  tail: Vector;
};

function moveRope(state: State, move: SingleMove): State {
  const headAfterMove = addVectors(state.head, move);

  const [distanceX, distanceY] = subtractVectors(state.tail, headAfterMove);

  if (Math.abs(distanceX) <= 1 && Math.abs(distanceY) <= 1) {
    return {
      ...state,
      head: headAfterMove,
    };
  }

  return { head: headAfterMove, tail: state.head };
}

function drawState(state: State) {
  const max = 40;
  const plane = Array.apply(null, Array(max)).map(() =>
    Array.from(".".repeat(max)),
  );

  plane[state.tail[1] + max / 2][state.tail[0] + max / 2] = "T";
  plane[state.head[1] + max / 2][state.head[0] + max / 2] = "H";
  console.log("\n\n");
  console.log(plane.map((row) => row.join(" ")).join("\n"));
  console.log("\n\n");
}

const initialState = {
  tail: [0, 0] as Vector,
  head: [0, 0] as Vector,
  visitedFields: [] as Vector[],
};
if (withVisualisation) {
  drawState(initialState);
}
const finalState = data
  .split("\n")
  .map(decodeMove)
  .flatMap(splitMoveToSingleSteps)
  .reduce<State & { visitedFields: Vector[] }>((state, move) => {
    if (withVisualisation) {
      console.log("Move", move);
    }
    const nextState = moveRope(state, move);
    if (withVisualisation) {
      drawState(nextState);
    }
    return {
      ...nextState,
      visitedFields: [...state.visitedFields, state.tail, nextState.tail],
    };
  }, initialState);

const visitedFields = new Set(
  finalState.visitedFields.map((vector) => vector.join(",")),
);
console.log("Number of visited fields", visitedFields.size);
