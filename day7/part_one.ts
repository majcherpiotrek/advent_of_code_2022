import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readstream = fs.createReadStream(path.resolve(__dirname, "input_data"), {
  encoding: "utf8",
});

type File = {
  type: "file";
  name: string;
  size: number;
};

type Directory = {
  type: "dir";
  parent: Directory | null;
  name: string;
  size: number;
  children: Record<string, File | Directory>;
};

type State = {
  directoriesTree: Directory;
  path: string[];
};

function getCurrentDirectory(state: State) {
  return state.path.reduce<Directory>((dir, pathElement, _) => {
    if (pathElement === "/") {
      return dir;
    }
    const childElement = dir.children[pathElement];
    if (!childElement || isFile(childElement)) {
      throw new Error(
        `Illegal state - current path leads to a file instead of a directory`,
      );
    }
    return childElement;
  }, state.directoriesTree);
}

function changeDirectory(state: State, dir: string) {
  if (dir === ".." && state.path.length > 1) {
    state.path.pop();
  } else {
    const currentDir = getCurrentDirectory(state);
    state.path.push(dir);
    if (currentDir.children[dir] === null) {
      const newDirectory: Directory = {
        type: "dir",
        children: {},
        name: dir,
        size: 0,
        parent: currentDir,
      };
      currentDir.children[dir] = newDirectory;
    }
  }
  return state;
}

type ChangeDirectoryCommand = {
  command: "cd";
  dir: string;
};

// type ListDirectoryCommand = {
//   command: "ls";
// };

type Command = ChangeDirectoryCommand;

function parseCommand(line: string): Command | null {
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

type DirectoryInfo = {
  dir: string;
};

type FileInfo = {
  size: number;
  file: string;
};

type ListingRow = DirectoryInfo | FileInfo;
const isDirectoryInfo = (row: ListingRow): row is DirectoryInfo => "dir" in row;

function parseListingRow(line: string): ListingRow | null {
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

type ParsedInputRow = Command | ListingRow;
const isCommand = (row: ParsedInputRow): row is Command => "command" in row;
type ParsedInput = ParsedInputRow[];

function parseInput(inputData: string) {
  const rows = inputData.split("\n");
  return rows.reduce<ParsedInput>((acc, row) => {
    const possibleCommand = parseCommand(row);
    if (possibleCommand) return [...acc, possibleCommand];
    const possibleListingRow = parseListingRow(row);
    if (possibleListingRow) return [...acc, possibleListingRow];
    return acc;
  }, []);
}

const isFile = (item: File | Directory): item is File => item.type === "file";
const isDirectory = (item: File | Directory): item is Directory =>
  item.type === "dir";

function processRow(state: State, row: ParsedInputRow) {
  if (isCommand(row)) {
    changeDirectory(state, row.dir);
  } else if (isDirectoryInfo(row)) {
    const currentDir = getCurrentDirectory(state);
    if (!currentDir.children[row.dir]) {
      const newDirectory: Directory = {
        type: "dir",
        children: {},
        name: row.dir,
        size: 0,
        parent: currentDir,
      };
      currentDir.children[row.dir] = newDirectory;
    }
  } else {
    const currentDir = getCurrentDirectory(state);
    if (!currentDir.children[row.file]) {
      const newFile: File = {
        name: row.file,
        size: row.size,
        type: "file",
      };

      currentDir.children[row.file] = newFile;
      for (let dir = currentDir; dir.parent !== null; dir = dir.parent) {
        dir.size += newFile.size;
      }
    }
  }

  return state;
}

readstream.on("data", (chunk) => {
  const tree = parseInput(chunk.toString()).reduce<State>(processRow, {
    directoriesTree: {
      name: "/",
      children: {},
      size: 0,
      type: "dir",
      parent: null,
    },
    path: ["/"],
  });

  function selectDirs(directory: Directory): Directory[] {
    const directories = [];
    if (directory.size < 100000) {
      directories.push(directory);
    }
    Object.values(directory.children)
      .filter<Directory>(isDirectory)
      .forEach((dir) => {
        const subDirectories = selectDirs(dir);
        directories.push(...subDirectories);
      });
    return directories;
  }

  const selected = selectDirs(tree.directoriesTree);

  console.log(selected.reduce((acc, dir) => acc + dir.size, 0));
});
