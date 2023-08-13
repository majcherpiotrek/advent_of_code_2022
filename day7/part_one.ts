/*
--- Day 7: No Space Left On Device ---
You can hear birds chirping and raindrops hitting leaves as the expedition proceeds. Occasionally, you can even hear much louder sounds in the distance; how big do the animals get out here, anyway?

The device the Elves gave you has problems with more than just its communication system. You try to run a system update:

$ system-update --please --pretty-please-with-sugar-on-top
Error: No space left on device
Perhaps you can delete some files to make space for the update?

You browse around the filesystem to assess the situation and save the resulting terminal output (your puzzle input). For example:

$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
The filesystem consists of a tree of files (plain data) and directories (which can contain other directories or files). The outermost directory is called /. You can navigate around the filesystem, moving into or out of directories and listing the contents of the directory you're currently in.

Within the terminal output, lines that begin with $ are commands you executed, very much like some modern computers:

cd means change directory. This changes which directory is the current directory, but the specific result depends on the argument:
cd x moves in one level: it looks in the current directory for the directory named x and makes it the current directory.
cd .. moves out one level: it finds the directory that contains the current directory, then makes that directory the current directory.
cd / switches the current directory to the outermost directory, /.
ls means list. It prints out all of the files and directories immediately contained by the current directory:
123 abc means that the current directory contains a file named abc with size 123.
dir xyz means that the current directory contains a directory named xyz.
Given the commands and output in the example above, you can determine that the filesystem looks visually like this:

- / (dir)
  - a (dir)
    - e (dir)
      - i (file, size=584)
    - f (file, size=29116)
    - g (file, size=2557)
    - h.lst (file, size=62596)
  - b.txt (file, size=14848514)
  - c.dat (file, size=8504156)
  - d (dir)
    - j (file, size=4060174)
    - d.log (file, size=8033020)
    - d.ext (file, size=5626152)
    - k (file, size=7214296)
Here, there are four directories: / (the outermost directory), a and d (which are in /), and e (which is in a). These directories also contain files of various sizes.

Since the disk is full, your first step should probably be to find directories that are good candidates for deletion. To do this, you need to determine the total size of each directory. The total size of a directory is the sum of the sizes of the files it contains, directly or indirectly. (Directories themselves do not count as having any intrinsic size.)

The total sizes of the directories above can be found as follows:

The total size of directory e is 584 because it contains a single file i of size 584 and no other directories.
The directory a has total size 94853 because it contains files f (size 29116), g (size 2557), and h.lst (size 62596), plus file i indirectly (a contains e which contains i).
Directory d has total size 24933642.
As the outermost directory, / contains every file. Its total size is 48381165, the sum of the size of every file.
To begin, find all of the directories with a total size of at most 100000, then calculate the sum of their total sizes. In the example above, these directories are a and e; the sum of their total sizes is 95437 (94853 + 584). (As in this example, this process can count files more than once!)

Find all of the directories with a total size of at most 100000. What is the sum of the total sizes of those directories?

Your puzzle answer was 1084134.
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
