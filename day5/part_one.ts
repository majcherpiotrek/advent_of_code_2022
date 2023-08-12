/*
--- Day 5: Supply Stacks ---
The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]        
[N] [C]    
[Z] [M] [P]
 1   2   3 
In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3
Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3
Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3
The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?
*/
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { parseInputData } from "./common.js";
import { CratesMap, Instruction } from "./types.js";
import { averageTimeSync } from "../profiling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.resolve(__dirname, "input_data"), {
  encoding: "utf-8",
});

function moveCraneUsingMutatingArrayFunctions(
  cratesMap: CratesMap,
  instruction: Instruction,
): CratesMap {
  for (let i = 0; i < instruction.numOfElements; i++) {
    const crateToMove = cratesMap[instruction.from.toString()]?.shift();
    if (crateToMove) {
      cratesMap[instruction.to.toString()]?.unshift(crateToMove);
    }
  }
  return cratesMap;
}

function moveCraneWithoutMutatingArrays(
  cratesMap: CratesMap,
  instruction: Instruction,
): CratesMap {
  const from = instruction.from.toString();
  const to = instruction.to.toString();
  const cratesToMove = cratesMap[from]?.slice(0, instruction.numOfElements);
  if (cratesToMove && cratesToMove.length > 0) {
    return {
      ...cratesMap,
      [from]: cratesMap[from]?.slice(instruction.numOfElements),
      [to]: [...cratesToMove.reverse(), ...cratesMap[to]],
    };
  } else {
    return cratesMap;
  }
}

const { instructions, cratesMap } = parseInputData(data);
const referenceCratesMap = structuredClone(cratesMap);

const cratesMapClone1 = structuredClone(cratesMap);
console.time("Mutable approach");
const afterReArrangement1 = instructions.reduce(
  moveCraneUsingMutatingArrayFunctions,
  cratesMapClone1,
);
console.timeEnd("Mutable approach");
console.log(
  "Mutable approach result: ",
  Object.values(afterReArrangement1)
    .map((crates) => crates[0])
    .join(""),
);
const cratesMapClone2 = structuredClone(cratesMap);
const avgTime1 = averageTimeSync(1000, () =>
  instructions.reduce(moveCraneUsingMutatingArrayFunctions, cratesMapClone2),
);
console.log(`Mutable approach avg time: ${avgTime1.toFixed(3)} ms`);
console.log(
  "Making sure it was mutated: ",
  JSON.stringify(cratesMapClone1) !== JSON.stringify(referenceCratesMap),
);

console.time("Immutable approach");
const afterReArrangement2 = instructions.reduce(
  moveCraneWithoutMutatingArrays,
  cratesMap,
);
console.timeEnd("Immutable approach");
console.log(
  "Immutable approach result: ",
  Object.values(afterReArrangement2)
    .map((crates) => crates[0])
    .join(""),
);
const avgTime2 = averageTimeSync(1000, () =>
  instructions.reduce(moveCraneWithoutMutatingArrays, cratesMap),
);
console.log(`Immutable approach avg time: ${avgTime2.toFixed(3)} ms`);
console.log(
  "Making sure it was actually immutable: ",
  JSON.stringify(cratesMap) === JSON.stringify(referenceCratesMap),
);
