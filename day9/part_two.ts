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
  tail: Vector[];
};

function moveRope(state: State, move: SingleMove): State {
  const headAfterMove = addVectors(state.head, move);

  const [distanceX, distanceY] = subtractVectors(state.tail[0], headAfterMove);

  if (Math.abs(distanceX) <= 1 && Math.abs(distanceY) <= 1) {
    return {
      ...state,
      head: headAfterMove,
    };
  }

  const nextState = {
    head: headAfterMove,
    tail: state.tail.map((knot, i, arr) => arr[i - 1] ?? state.head),
  };

  // console.log("next", nextState);
  return nextState;
}

function drawState(state: State) {
  console.clear();
  const max = 50;
  const plane = Array.apply(null, Array(max)).map(() =>
    Array.from(".".repeat(max)),
  );

  plane[state.head[1] + max / 2][state.head[0] + max / 2] = "H";

  state.tail.forEach((knot, i) => {
    plane[knot[1] + max / 2][knot[0] + max / 2] = `${i + 1}`;
  });

  for (let i = 0; i < max; i++) {
    const row = plane[i].join(" ");
    process.stdout.write(row + "\n");
  }
}

const initialState = {
  head: [0, 0] as Vector,
  tail: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ] as Vector[],
  visitedFields: [] as Vector[],
};
if (withVisualisation) {
  drawState(initialState);
}
const finalState = data
  .split("\n")
  .map(decodeMove)
  .flatMap(splitMoveToSingleSteps)
  .reduce<State & { visitedFields: Vector[] }>((state, move, i) => {
    const nextState = moveRope(state, move);
    if (withVisualisation) {
      setTimeout(() => {
        drawState(nextState);
      }, i * 250);
    }
    return {
      ...nextState,
      visitedFields: [...state.visitedFields, state.tail[8], nextState.tail[8]],
    };
  }, initialState);

const visitedFields = new Set(
  finalState.visitedFields.map((vector) => vector.join(",")),
);

console.log("visitedFields", visitedFields);
console.log("Number of visited fields", visitedFields.size);
