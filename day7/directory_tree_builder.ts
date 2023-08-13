import {
  Directory,
  ParsedInputRow,
  isCommand,
  isDirectoryInfo,
  isFile,
  File,
  isDirectory,
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

function addEmptyChildDirectoryIfNotExists(
  directory: Directory,
  childDirName: string,
): Directory {
  if (!directory.children[childDirName]) {
    const newDirectory: Directory = {
      type: "dir",
      children: {},
      name: childDirName,
      size: 0,
      parent: directory,
    };
    // TODO might be actually better to mutate the directory for performance reasons
    return {
      ...directory,
      children: {
        ...directory.children,
        [childDirName]: newDirectory,
      },
    };
  }
  return directory;
}

export type State = {
  directoriesTree: Directory;
  path: string[];
};

function processChangeDirectoryCommand(
  currentDirectory: Directory,
  dir: string,
) {
  if (dir === "..") {
    return currentDirectory.parent;
  } else {
    const updatedDirectory = addEmptyChildDirectoryIfNotExists(
      currentDirectory,
      dir,
    );
    return updatedDirectory;
  }
}

function processRow(currentDirectory: Directory, row: ParsedInputRow) {
  if (isCommand(row)) {
    state, row.dir;
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
