/*
--- Part Two ---
As you finish identifying the misplaced items, the Elves come to you with another issue.

For safety, the Elves are divided into groups of three. Every Elf carries a badge that identifies their group. For efficiency, within each group of three Elves, the badge is the only item type carried by all three Elves. That is, if a group's badge is item type B, then all three Elves will have item type B somewhere in their rucksack, and at most two of the Elves will be carrying any other item type.

The problem is that someone forgot to put this year's updated authenticity sticker on the badges. All of the badges need to be pulled out of the rucksacks so the new authenticity stickers can be attached.

Additionally, nobody wrote down which item type corresponds to each group's badges. The only way to tell which item type is the right one is by finding the one item type that is common between all three Elves in each group.

Every set of three lines in your list corresponds to a single group, but each group can have a different badge item type. So, in the above example, the first group's rucksacks are the first three lines:

vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
And the second group's rucksacks are the next three lines:

wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
In the first group, the only item type that appears in all three rucksacks is lowercase r; this must be their badges. In the second group, their badge item type must be Z.

Priorities for these items must still be found to organize the sticker attachment efforts: here, they are 18 (r) for the first group and 52 (Z) for the second group. The sum of these is 70.

Find the item type that corresponds to the badges of each three-Elf group. What is the sum of the priorities of those item types?
*/
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { averageTimeSync } from "../profiling.js";
import { getItemPriority } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.resolve(__dirname, "./input_data"), {
  encoding: "utf8",
});

function checkBadges(rucksacksList: string): number {
  const rucksacks = rucksacksList.split("\n");
  let sumOfPriorities = 0;
  for (let i = 0; i <= rucksacks.length - 3; i += 3) {
    for (const item of rucksacks[i].split("")) {
      if (rucksacks[i + 1].includes(item) && rucksacks[i + 2].includes(item)) {
        sumOfPriorities += getItemPriority(item);
        break;
      }
    }
  }
  return sumOfPriorities;
}

console.log("Result", checkBadges(data));

const avgTime = averageTimeSync(10000, () => checkBadges(data));
console.log("Avg time", avgTime);
