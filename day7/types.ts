export type File = {
  type: "file";
  name: string;
  size: number;
};

export type Directory = {
  type: "dir";
  parent: Directory | null;
  name: string;
  size: number;
  children: Record<string, File | Directory>;
};

export const isFile = (item: File | Directory): item is File =>
  item.type === "file";
export const isDirectory = (item: File | Directory): item is Directory =>
  item.type === "dir";

export type ChangeDirectoryCommand = {
  command: "cd";
  dir: string;
};

export type DirectoryInfo = {
  dir: string;
};

export type FileInfo = {
  size: number;
  file: string;
};

export type LsCommandResultRow = DirectoryInfo | FileInfo;
export const isDirectoryInfo = (
  row: LsCommandResultRow,
): row is DirectoryInfo => "dir" in row;

export const isFileInfo = (row: LsCommandResultRow): row is FileInfo =>
  "file" in row;

export type ParsedInputRow = ChangeDirectoryCommand | LsCommandResultRow;
export const isChangeDirectoryCommand = (
  row: ParsedInputRow,
): row is ChangeDirectoryCommand => "command" in row;
export type ParsedInput = ParsedInputRow[];
