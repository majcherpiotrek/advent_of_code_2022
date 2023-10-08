/*
Runtime
Details
45ms
Beats 96.29%of users with TypeScript
Memory
Details
44.83MB
Beats 6.82%of users with TypeScript
*/
function removeElement(nums: number[], val: number): number {
  nums.sort((_, b) => b === val ? -1 : 0); 
  let k = nums.length;
  while(nums[k-1] === val) k--;
  return k;
};

function removeElement2(nums: number[], val: number): number {
  let deleted = 0;
  let originalSize = nums.length;

  for(let i = 0; i < nums.length; i++) {
    if(nums[i] === val) {
      nums.splice(i, 1);
      deleted++;
      i--;
    }
  }

  return originalSize - deleted;
};
