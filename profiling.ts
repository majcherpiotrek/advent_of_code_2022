export async function averageTimeAsync(
  iterations: number,
  fn: () => Promise<unknown>,
) {
  let sumTime = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    sumTime = sumTime + end - start;
  }

  return sumTime / iterations;
}

export function averageTimeSync(iterations: number, fn: () => unknown) {
  let sumTime = 0;

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    const time = (sumTime = sumTime + end - start);
  }

  return sumTime / iterations;
}
