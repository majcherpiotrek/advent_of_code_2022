import type { Vector } from "./types";

export function decodeMove(row: string): Vector {
  const [direction, distanceStr] = row.split(" ");

  const distance = parseInt(distanceStr);

  if (Number.isNaN(distanceStr)) {
    return {
      x: 0,
      y: 0,
    };
  }

  switch (direction) {
    case "R":
      return {
        x: distance,
        y: 0,
      };
    case "L":
      return {
        x: -1 * distance,
        y: 0,
      };
    case "U":
      return {
        x: 0,
        y: distance,
      };
    case "D":
      return {
        x: 0,
        y: -1 * distance,
      };
    default:
      return {
        x: 0,
        y: 0,
      };
  }
}

export function addVectors(a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function subtractVectors(a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function splitMoveToSingleSteps(move: Vector): Vector[] {
  const xMoves = Array.apply(null, Array(Math.abs(move.x))).map(() => ({
    x: move.x > 0 ? 1 : -1,
    y: 0,
  }));
  const yMoves = Array.apply(null, Array(Math.abs(move.y))).map(() => ({
    x: 0,
    y: move.y > 0 ? 1 : -1,
  }));
  return [...xMoves, ...yMoves];
}
