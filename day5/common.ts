import { Column, CratesMap, Instruction } from "./types.js";

function parseColumnIndexes(cratesColumnIndexesStr: string): Column[] {
  const numbersRegExp = /[0-9]+/g;
  return Array.from(cratesColumnIndexesStr.matchAll(numbersRegExp)).flatMap(
    (match) => {
      const num = parseInt(match[0]);
      return Number.isNaN(num) || match.index === undefined
        ? []
        : [
            {
              columnIndex: num,
              matrixIndex: match.index,
            },
          ];
    },
  );
}

function parseInstruction(instruction: string): Instruction | null {
  //move 1 from 2 to 1
  const [_, numOfElementsStr, __, fromStr, ___, toStr] =
    instruction.split(/\s+/g);
  const numOfElements = parseInt(numOfElementsStr);
  const from = parseInt(fromStr);
  const to = parseInt(toStr);
  if (Number.isNaN(numOfElements) || Number.isNaN(from) || Number.isNaN(to)) {
    return null;
  }
  return {
    numOfElements,
    from,
    to,
  };
}

function parseInstructions(instructionsInputStr: string): Instruction[] {
  return instructionsInputStr
    .split("\n")
    .map(parseInstruction)
    .filter((instr): instr is Instruction => instr !== null);
}

function parseCratesMap(cratesMapInputStr: string): CratesMap {
  const cratesRows = cratesMapInputStr.split("\n");
  const columns = parseColumnIndexes(cratesRows.at(-1) ?? "");

  const crates = cratesRows.slice(0, cratesRows.length - 1).map((row) => {
    return columns.map(({ matrixIndex }) => {
      const crateOrEmpty = row.charAt(matrixIndex);
      return /[A-Z]/g.test(crateOrEmpty) ? crateOrEmpty : null;
    });
  });

  return columns.reduce((acc, column, index) => {
    const columnContent = crates.flatMap((cratesRow) => {
      const crate = cratesRow[index];
      return crate ? [crate] : [];
    });
    return {
      ...acc,
      [column.columnIndex]: columnContent,
    };
  }, {});
}

export function parseInputData(data: string): {
  cratesMap: CratesMap;
  instructions: Instruction[];
} {
  const [cratesStr, instructionsStr] = data.split("\n\n");
  return {
    cratesMap: parseCratesMap(cratesStr),
    instructions: parseInstructions(instructionsStr),
  };
}
