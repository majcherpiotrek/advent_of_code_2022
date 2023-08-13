import {
  ChangeDirectoryCommand,
  LsCommandResultRow,
  ParsedInput,
} from "./types.js";

function parseChangeDirectoryCommand(
  line: string,
): ChangeDirectoryCommand | null {
  if (!line.startsWith("$")) {
    return null;
  }
  const [_, command, dir] = line.split(/\s+/g);
  switch (command) {
    case "cd":
      return dir ? { command, dir } : null;
    default:
      return null;
  }
}

function parseLsCommandResultRow(line: string): LsCommandResultRow | null {
  const [sizeOrDir, name] = line.split(/\s+/g);
  if (sizeOrDir === "dir") {
    return name ? { dir: name } : null;
  }
  const size = parseInt(sizeOrDir, 10);
  if (!Number.isNaN(size)) {
    return name ? { file: name, size } : null;
  }
  return null;
}

export function parseInput(inputData: string) {
  const rows = inputData.split("\n");
  return rows.reduce<ParsedInput>((acc, row) => {
    if (/^\$\s+ls/g.test(row)) {
      // The rows with ls command are ignored because they don't provide any valuable logical input,
      // only the result rows of the ls command are parsed
      return acc;
    }
    const possibleCommand = parseChangeDirectoryCommand(row);
    if (possibleCommand) return [...acc, possibleCommand];
    const possibleListingRow = parseLsCommandResultRow(row);
    if (possibleListingRow) return [...acc, possibleListingRow];
    return acc;
  }, []);
}
