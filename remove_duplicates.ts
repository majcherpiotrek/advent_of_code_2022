function removeDuplicates(nums: number[]): number {
  const set = new Set(nums);
  nums.splice(0, set.size, ...Array.from(set));
  return set.size;
};


