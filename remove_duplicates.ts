function removeDuplicates(nums: number[]): number {
  const set = new Set(nums);
  nums.splice(0, set.size, ...Array.from(set));
  return set.size;
};

function removeDuplicates2(nums: number[]): number {
  let numDuplicates = 0;
  for(let i = 1; i < nums.length;) {
    if(nums[i] > nums[i-1]) {
      numDuplicates = 0;
      i++;
    } else {
      numDuplicates++;
      if(numDuplicates === 2) {
        nums.splice(i, 1);
        numDuplicates--;
      } else {
        i++;
      }
    }
  }
  return nums.length;
};


const a = [1, 2, 2, 2, 3, 3, 3, 4, 5, 6, 7, 7, 7, 7, 8];

removeDuplicates2(a);

console.log(a);
