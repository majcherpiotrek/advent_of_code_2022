function majorityElement(nums: number[]): number {
  const elementsCount: Record<number, number> = {};
  let currentHighest: number = nums[0];
  nums.forEach((n) => {
    const occurences = (elementsCount[n] ?? 0) + 1;
    elementsCount[n] = occurences;
    const currentHighestValue = elementsCount[currentHighest];
    if (occurences > currentHighestValue) {
      currentHighest = n;
    }
  });
  return currentHighest;
};

const b = [2,2,1,1,1,2,2];
console.log(majorityElement(b));
