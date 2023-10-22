import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, "input_data");

const data = fs.readFileSync(filePath, { encoding: "utf8" });

const InstructionName = {
  ADDX: "addx",
  NOOP: "noop",
} as const;

type InstructionName = (typeof InstructionName)[keyof typeof InstructionName];

type Instruction =
  | { name: (typeof InstructionName)["ADDX"]; value: number }
  | { name: (typeof InstructionName)["NOOP"] };

function decodeInstruction(input: string): Instruction {
  const [instructionName, valueStr] = input.split(/\s/);

  switch (instructionName) {
    case InstructionName.ADDX:
      const value = parseInt(valueStr, 10);
      if (isNaN(value)) {
        throw new Error(
          `Invalid ${InstructionName.ADDX} instruction value: ${valueStr}. Expected integer.`,
        );
      }
      return { name: InstructionName.ADDX, value: Number(value) };
    case InstructionName.NOOP:
      return { name: InstructionName.NOOP };
    default:
      throw new Error(`Invalid instruction: ${instructionName}`);
  }
}

type Program = Instruction[];

function decodeProgram(input: string): Program {
  return input
    .split("\n")
    .flatMap((row) => (row === "" ? [] : [decodeInstruction(row)]));
}

const SCREEN_WIDTH = 40;
const SCREEN_HEIGHT = 6;

interface ProgramState {
  X: number;
  cycle: number;
}

const initialState: ProgramState = {
  X: 1,
  cycle: 0,
};

function processInstruction(
  state: ProgramState,
  instruction: Instruction,
  onCycleSnapshot: (state: ProgramState) => void,
): ProgramState {
  switch (instruction.name) {
    case InstructionName.ADDX:
      for (let i = 1; i <= 2; i++) {
        state.cycle++;
        onCycleSnapshot(state);
        if (i === 2) {
          state.X = state.X + instruction.value;
        }
      }
      return state;
    case InstructionName.NOOP:
      state.cycle++;
      onCycleSnapshot(state);
      return state;
  }
}

function currentlyRenderedPixel(state: ProgramState): [number, number] {
  const x = (state.cycle - 1) % SCREEN_WIDTH;
  const y = Math.floor((state.cycle - 1) / SCREEN_WIDTH);
  return [x, y];
}

function createScreenRenderer(screen: string[][]) {
  return function (state: ProgramState) {
    const [x, y] = currentlyRenderedPixel(state);
    if (x >= state.X - 1 && x <= state.X + 1) {
      screen[y][x] = "#";
    }
  };
}

const screen: string[][] = Array(SCREEN_HEIGHT)
  .fill(".".repeat(SCREEN_WIDTH))
  .map((r) => r.split(""));

function runProgram(
  program: Program,
  initialState: ProgramState,
  rerenderScreen: (state: ProgramState) => void,
): ProgramState {
  return program.reduce((state, instruction) => {
    return processInstruction(state, instruction, rerenderScreen);
  }, initialState);
}

runProgram(decodeProgram(data), initialState, createScreenRenderer(screen));

const result = screen.map((row) => row.join("")).join("\n");
console.log("RESULT:\n\n");
console.log(result);
