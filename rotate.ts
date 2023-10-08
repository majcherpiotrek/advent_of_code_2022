function rotate(nums: number[], k: number): void {
  nums.unshift(...nums.splice(nums.length - (k % nums.length)));
};
