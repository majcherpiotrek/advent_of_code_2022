/**
 Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  const buffer = nums1.slice(0, m);

  let sourceIndex = 0;
  let destinationIndex = 0;
  let bufferIndex = 0;

  while (destinationIndex < m + n) {
    const sourceValue = nums2[sourceIndex];
    const bufferValue = buffer[bufferIndex];
    if (sourceValue === undefined && bufferValue !== undefined) {
      nums1[destinationIndex] = bufferValue;
      bufferIndex++;
    } else if (sourceValue !== undefined && bufferValue === undefined) {
      nums1[destinationIndex] = sourceValue;
      sourceIndex++;
    } else if (sourceValue !== undefined && bufferValue !== undefined) {
      if (sourceValue < bufferValue) {
        nums1[destinationIndex] = sourceValue;
        sourceIndex++;
      } else if (sourceValue >= bufferValue) {
        nums1[destinationIndex] = bufferValue;
        bufferIndex++;
      }
    }
    destinationIndex++;
  }
};
