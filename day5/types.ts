export type Column = {
  columnIndex: number;
  matrixIndex: number;
};

export type Instruction = {
  numOfElements: number;
  from: number;
  to: number;
};

export type CratesMap = Record<string, string[]>;
