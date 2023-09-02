import type { RopeState } from "./types";

export function drawRope(state: RopeState) {
  console.clear();
  const size = 50;
  const plane = Array.apply(null, Array(size)).map(() =>
    Array.from(".".repeat(size)),
  );
  const center = Math.floor(size / 2);

  plane[-1 * state.head.y + center][state.head.x + center] = "H";

  state.tail.forEach((knot, i) => {
    plane[-1 * knot.y + center][knot.x + center] = `${i}`;
  });

  for (let i = 0; i < size; i++) {
    const row = plane[i].join(" ");
    process.stdout.write(row + "\n");
  }
}
