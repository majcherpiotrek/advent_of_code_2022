import { averageTimeSync } from "./profiling.js";

const swap = (arr: number[], i: number, j: number) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
};

const quickSort = (arr: number[]) => {
  if (arr.length < 2) {
    return;
  }
  const sortInternal = (start: number, end: number, level = 0) => {
    if (end - start < 1) return;
    const pivot = arr[end];

    let i = start;
    let k = start;
    while (i < end) {
      const elem = arr[i];

      if (elem <= pivot) {
        if (i !== k) {
          swap(arr, i, k);
        }
        k++;
      }
      i++;
    }
    if (k !== end) {
      swap(arr, k, end);
    }

    sortInternal(start, k - 1, level + 1);
    sortInternal(k + 1, end, level + 1);
  };

  sortInternal(0, arr.length - 1);
};

const avgTimeNative = averageTimeSync(100000, () =>
  [
    9, 8, 7, 5, 6, 4, 3, 2, 1, 123, 12, 9, 10, 11, 0, -1, 567, 234, 11, 3, 5, 7,
  ].sort((a, b) => a - b),
);
console.log("Avg time native sort", avgTimeNative);

const avgTime = averageTimeSync(100000, () =>
  quickSort([
    9, 8, 7, 5, 6, 4, 3, 2, 1, 123, 12, 9, 10, 11, 0, -1, 567, 234, 11, 3, 5, 7,
  ]),
);

console.log("Avg time custom sort", avgTime);
