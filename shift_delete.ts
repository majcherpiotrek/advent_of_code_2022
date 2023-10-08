export function shiftDelete<T>(arr: T[], index: number) {
  const isInFirstHalf = arr.length / 2 > index;
  if (isInFirstHalf) {
    for (let i = index; i > 0; i--) {
      arr[i] = arr[i - 1];
    }
    arr.shift();
  } else {
    for (let i = index; i < arr.length - 2; i++) {
      arr[i] = arr[i + 1];
    }
    arr.pop()
  }
}
