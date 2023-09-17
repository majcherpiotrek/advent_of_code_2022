import { fileURLToPath } from "url";
import path from "path";
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
  cycleSnapshot: (state: ProgramState) => void,
): ProgramState {
  switch (instruction.name) {
    case InstructionName.ADDX:
      for (let i = 1; i <= 2; i++) {
        state.cycle++;
        cycleSnapshot(state);
        if (i === 2) {
          state.X = state.X + instruction.value;
        }
      }
      return state;
    case InstructionName.NOOP:
      state.cycle++;
      cycleSnapshot(state);
      return state;
  }
}

const snapshots: ProgramState[] = [];

const shouldSaveSnapshot = (cycle: number) =>
  cycle <= 220 && (cycle === 20 || (cycle - 20) % 40 === 0);

function runProgram(
  program: Program,
  initialState: ProgramState,
  shouldSaveSnapshot: (cycle: number) => boolean,
): ProgramState {
  return program.reduce((state, instruction) => {
    return processInstruction(state, instruction, (state) => {
      if (shouldSaveSnapshot(state.cycle)) {
        snapshots.push({ ...state });
      }
    });
  }, initialState);
}

runProgram(decodeProgram(data), initialState, shouldSaveSnapshot);

console.log("SNAPSHOTS", snapshots);
const signalStrengths = snapshots.map((s) => s.X * s.cycle);
console.log("SIGNAL STRENGTHS", signalStrengths);
console.log(
  "Result",
  signalStrengths.reduce((a, b) => a + b, 0),
);
