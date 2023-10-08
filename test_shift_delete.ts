import { shiftDelete } from "./shift_delete.js";


function arraysEqual(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function runTests() {
  // Test Case 1: Valid deletion
  const arr1 = [1, 2, 3, 4, 5];
  const index1 = 2;
  shiftDelete(arr1, index1);
  const expected1 = [1, 2, 4, 5];
  console.log("Test Case 1:", arr1);
  console.log("Test Case 1:", arraysEqual(arr1, expected1) ? "Passed" : "Failed");
  // Test Case 2: Valid deletion at the beginning
  const arr2 = [10, 20, 30, 40];
  const index2 = 0;
  shiftDelete(arr2, index2);
  const expected2 = [20, 30, 40];
  console.log("Test Case 2:", arr2);
  console.log("Test Case 2:", arraysEqual(arr2, expected2) ? "Passed" : "Failed");
  // Test Case 3: Valid deletion at the end
  const arr3 = [100, 200, 300, 400];
  const index3 = 3;
  shiftDelete(arr3, index3); 
  const expected3 = [100, 200, 300];
  console.log("Test Case 3:", arraysEqual(arr3, expected3) ? "Passed" : "Failed");
}


runTests();



function measurePerformance() {
  const numTests = 10000;
  const arrayLength = 10000;
  let customFunctionTotalTime = 0;
  let spliceMethodTotalTime = 0;

  for (let i = 0; i < numTests; i++) {
    // Create a random array of 10,000 elements
    const testArray = Array.from({ length: arrayLength }, () => Math.random());

    // Generate a random index (linear distribution)
    const index = Math.floor(Math.random() * arrayLength);

    // Measure the time taken by your custom "shiftDelete" function
    const customFunctionStartTime = performance.now();
    shiftDelete(testArray, index);
    const customFunctionEndTime = performance.now();
    customFunctionTotalTime += customFunctionEndTime - customFunctionStartTime;

    // Measure the time taken by the built-in "splice" method
    const spliceMethodStartTime = performance.now();
    testArray.splice(index, 1);
    const spliceMethodEndTime = performance.now();
    spliceMethodTotalTime += spliceMethodEndTime - spliceMethodStartTime;
  }

  const customFunctionAverageTime = customFunctionTotalTime / numTests;
  const spliceMethodAverageTime = spliceMethodTotalTime / numTests;

  console.log("Custom Function Average Time:", customFunctionAverageTime.toFixed(4), "ms");
  console.log("Splice Method Average Time:", spliceMethodAverageTime.toFixed(4), "ms");
}

measurePerformance();

