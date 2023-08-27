let state = [
  ["x", ".", "."],
  [".", ".", "."],
  [".", ".", "."],
];
let position = [0, 0];

let i = 0;
let j = 0;
const interval = setInterval(() => {
  console.clear();
  state.forEach((row) => {
    process.stdout.write(row.join(" ") + "\n");
  });

  state[i % 3][j % 3] = ".";

  if (j % 3 === 2) {
    i++;
  }
  j++;
  state[i % 3][j % 3] = "x";
}, 250);

setTimeout(() => {
  clearInterval(interval);
  process.stdout.write("\n");
}, 10000);
