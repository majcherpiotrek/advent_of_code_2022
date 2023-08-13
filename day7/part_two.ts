/*
--- Part Two ---
Now, you're ready to choose a directory to delete.

The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.

In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.

To achieve this, you have the following options:

Delete directory e, which would increase unused space by 584.
Delete directory a, which would increase unused space by 94853.
Delete directory d, which would increase unused space by 24933642.
Delete directory /, which would increase unused space by 48381165.
Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.

Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?
*/

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

      for (
        let dir: Directory | null = currentDir;
        dir !== null;
        dir = dir.parent
      ) {
        dir.size += newFile.size;
      }
    }
  }

  return state;
}

const TOTAL_DISK_SPACE = 70000000;
const FREE_SPACE_REQUIRED = 30000000;

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

  const rootDirSize = tree.directoriesTree.size;
  console.log("root size", rootDirSize);

  const spaceLeftOnDevice = TOTAL_DISK_SPACE - rootDirSize;
  console.log("space left", spaceLeftOnDevice);

  const minSpaceRequiredToDFreeUp = FREE_SPACE_REQUIRED - spaceLeftOnDevice;
  console.log(console.log("necessery to free up", minSpaceRequiredToDFreeUp));

  function selectAllDirs(directory: Directory): Directory[] {
    const directories = [];

    directories.push(directory);

    Object.values(directory.children)
      .filter<Directory>(isDirectory)
      .forEach((dir) => {
        const subDirectories = selectAllDirs(dir);
        directories.push(...subDirectories);
      });
    return directories;
  }

  const allDirs = selectAllDirs(tree.directoriesTree);
  const sortedDirs = allDirs.sort((a, b) => a.size - b.size);
  console.log(
    "sorted dirs",
    sortedDirs.map((dir) => dir.size),
  );

  const dirToDelete = sortedDirs.find(
    (dir) => dir.size > minSpaceRequiredToDFreeUp,
  );

  console.log("Directory to delete", {
    name: dirToDelete?.name,
    size: dirToDelete?.size,
  });
});
