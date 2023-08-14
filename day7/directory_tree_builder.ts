import {
  Directory,
  ParsedInputRow,
  isChangeDirectoryCommand,
  isDirectoryInfo,
  isFile,
  File,
  isDirectory,
  ParsedInput,
  isFileInfo,
} from "./types.js";

function resolvePath(
  directoryTree: Directory,
  path: string[],
): Directory | File | null {
  return path.reduce<Directory | File | null>(
    (resolvedElement, pathElement) => {
      if (resolvedElement === null) {
        return null;
      } else if (isFile(resolvedElement)) {
        return null;
      } else {
        const childElement = resolvedElement.children[pathElement];
        return childElement;
      }
    },
    directoryTree,
  );
}

type State = {
  directoriesTree: Directory;
  path: string[];
};

const buildEmptyDirectory = (
  parent: Directory,
  dirName: string,
): Directory => ({
  type: "dir",
  children: {},
  name: dirName,
  size: 0,
  parent,
});

function processRow(state: State, row: ParsedInputRow): State {
  const currentDir = resolvePath(state.directoriesTree, state.path);
  if (currentDir && isDirectory(currentDir)) {
    if (isChangeDirectoryCommand(row)) {
      if (row.dir === "..") {
        state.path.pop();
        return state;
      } else if (row.dir === "/") {
        return state;
      } else if (currentDir.children[row.dir]) {
        state.path.push(row.dir);
        return state;
      } else {
        currentDir.children[row.dir] = buildEmptyDirectory(currentDir, row.dir);
        return state;
      }
    } else if (
      isDirectoryInfo(row) &&
      !currentDir.children[row.dir] &&
      row.dir !== "/"
    ) {
      currentDir.children[row.dir] = buildEmptyDirectory(currentDir, row.dir);
      return state;
    } else if (isFileInfo(row) && !currentDir.children[row.file]) {
      const newFile: File = {
        name: row.file,
        size: row.size,
        type: "file",
      };

      currentDir.children[row.file] = newFile;

      for (let dir = currentDir; dir.parent !== null; dir = dir.parent) {
        dir.size += newFile.size;
      }

      state.directoriesTree.size += newFile.size;

      return state;
    }
  }

  return state;
}

export function buildDirectoriesTree(input: ParsedInput): Directory {
  const initialState: State = {
    directoriesTree: {
      name: "/",
      children: {},
      parent: null,
      size: 0,
      type: "dir",
    },
    path: [],
  };

  return input.reduce(processRow, initialState).directoriesTree;
}
