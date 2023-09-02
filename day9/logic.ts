import type { RopeState, Vector } from "./types";
import { addVectors, subtractVectors } from "./utils.js";
import { drawRope } from "./visualization.js";

export function applyMove(state: RopeState, move: Vector): RopeState {
  if (move.x === 0 && move.y === 0) {
    return state;
  }
  const headAfterMove = addVectors(state.head, move);

  if (state.tail.length === 0) {
    return {
      head: headAfterMove,
      tail: [],
    };
  }

  const distanceToHead = subtractVectors(headAfterMove, state.tail[0]);

  if (Math.abs(distanceToHead.x) > 1 || Math.abs(distanceToHead.y) > 1) {
    // Tails needs to catch up
    if (headAfterMove.x === state.tail[0].x) {
      // In the same column
      const tailMoveVector = {
        x: 0,
        y: Math.sign(distanceToHead.y),
      };
      const tailState = applyMove(
        { head: state.tail[0], tail: state.tail.slice(1) },
        tailMoveVector,
      );
      return {
        head: headAfterMove,
        tail: [tailState.head, ...tailState.tail],
      };
    }

    if (headAfterMove.y === state.tail[0].y) {
      // In the same row
      const tailMoveVector = {
        x: Math.sign(distanceToHead.x),
        y: 0,
      };
      const tailState = applyMove(
        { head: state.tail[0], tail: state.tail.slice(1) },
        tailMoveVector,
      );
      return {
        head: headAfterMove,
        tail: [tailState.head, ...tailState.tail],
      };
    }

    // Need to move diagonally
    const tailMoveVector = {
      x: Math.sign(distanceToHead.x),
      y: Math.sign(distanceToHead.y),
    };
    const tailState = applyMove(
      { head: state.tail[0], tail: state.tail.slice(1) },
      tailMoveVector,
    );
    return {
      head: headAfterMove,
      tail: [tailState.head, ...tailState.tail],
    };
  }

  return {
    ...state,
    head: headAfterMove,
  };
}

export function moveRope(
  initialRopeState: RopeState,
  moves: Vector[],
  withVisualisation = false,
): RopeState & { tailVisitedFieldsNumber: number } {
  const tailStartingField = initialRopeState.tail.at(-1);

  const finalState = moves.reduce<RopeState & { visitedFields: Vector[] }>(
    (state, move, i) => {
      if (withVisualisation) {
        setTimeout(() => {
          drawRope(state);
        }, i * 300);
      }
      const nextState = applyMove(state, move);
      const tailField = nextState.tail.at(-1);

      return {
        ...nextState,
        visitedFields: [
          ...state.visitedFields,
          ...(tailField ? [tailField] : []),
        ],
      };
    },
    {
      ...initialRopeState,
      visitedFields: tailStartingField ? [tailStartingField] : [],
    },
  );

  const visitedFields = new Set(
    finalState.visitedFields.map((vector) =>
      vector ? `${vector.x},${vector.y}` : "",
    ),
  );

  return {
    ...finalState,
    tailVisitedFieldsNumber: visitedFields.size,
  };
}
