function removeElement(nums: number[], val: number): number {
  nums.sort((_, b) => b === val ? -1 : 0); 
  let k = nums.length;
  while(nums[k-1] === val) k--;
  return k;
};
