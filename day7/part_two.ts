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
import { parseInput } from "./parser.js";
import { buildDirectoriesTree } from "./directory_tree_builder.js";
import { Directory, isDirectory } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readstream = fs.createReadStream(path.resolve(__dirname, "input_data"), {
  encoding: "utf8",
});

const TOTAL_DISK_SPACE = 70000000;
const FREE_SPACE_REQUIRED = 30000000;

readstream.on("data", (chunk) => {
  const input = parseInput(chunk.toString());
  const directoriesTree = buildDirectoriesTree(input);

  const rootDirSize = directoriesTree.size;
  console.log("root size", rootDirSize);

  const spaceLeftOnDevice = TOTAL_DISK_SPACE - rootDirSize;
  console.log("space left", spaceLeftOnDevice);

  const minSpaceRequiredToFreeUp = FREE_SPACE_REQUIRED - spaceLeftOnDevice;
  console.log(console.log("necessery to free up", minSpaceRequiredToFreeUp));

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

  const allDirs = selectAllDirs(directoriesTree);
  const sortedDirs = allDirs.sort((a, b) => a.size - b.size);
  console.log(
    "sorted dirs",
    sortedDirs.map((dir) => dir.size),
  );

  const dirToDelete = sortedDirs.find(
    (dir) => dir.size > minSpaceRequiredToFreeUp,
  );

  console.log("Directory to delete", {
    name: dirToDelete?.name,
    size: dirToDelete?.size,
  });
});
