/*
--- Day 3: Rucksack Reorganization ---
One Elf has the important job of loading all of the rucksacks with supplies for the jungle journey. Unfortunately, that Elf didn't quite follow the packing instructions, and so a few items now need to be rearranged.

Each rucksack has two large compartments. All items of a given type are meant to go into exactly one of the two compartments. The Elf that did the packing failed to follow this rule for exactly one item type per rucksack.

The Elves have made a list of all of the items currently in each rucksack (your puzzle input), but they need your help finding the errors. Every item type is identified by a single lowercase or uppercase letter (that is, a and A refer to different types of items).

The list of items for each rucksack is given as characters all on a single line. A given rucksack always has the same number of items in each of its two compartments, so the first half of the characters represent items in the first compartment, while the second half of the characters represent items in the second compartment.

For example, suppose you have the following list of contents from six rucksacks:

vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
The first rucksack contains the items vJrwpWtwJgWrhcsFMMfFFhFp, which means its first compartment contains the items vJrwpWtwJgWr, while the second compartment contains the items hcsFMMfFFhFp. The only item type that appears in both compartments is lowercase p.
The second rucksack's compartments contain jqHRNqRjqzjGDLGL and rsFMfFZSrLrFZsSL. The only item type that appears in both compartments is uppercase L.
The third rucksack's compartments contain PmmdzqPrV and vPwwTWBwg; the only common item type is uppercase P.
The fourth rucksack's compartments only share item type v.
The fifth rucksack's compartments only share item type t.
The sixth rucksack's compartments only share item type s.
To help prioritize item rearrangement, every item type can be converted to a priority:

Lowercase item types a through z have priorities 1 through 26.
Uppercase item types A through Z have priorities 27 through 52.
In the above example, the priority of the item type that appears in both compartments of each rucksack is 16 (p), 38 (L), 42 (P), 22 (v), 20 (t), and 19 (s); the sum of these is 157.

Find the item type that appears in both compartments of each rucksack. What is the sum of the priorities of those item types?
*/

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { averageTimeSync } from "../profiling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.resolve(__dirname, "./input_data"), {
  encoding: "utf8",
});

const a_code = "a".charCodeAt(0);
const A_code = "A".charCodeAt(0);
const z_code = "z".charCodeAt(0);
const Z_code = "Z".charCodeAt(0);

const a_priority = 1;
const A_priority = 27;

function getItemPriority(c: string): number {
  const code = c.charCodeAt(0);

  if (code >= a_code && code <= z_code) {
    return code - (a_code - a_priority);
  } else if (code >= A_code && code <= Z_code) {
    return code - (A_code - A_priority);
  } else {
    return 0;
  }
}

function checkRucksacks(rucksacksList: string) {
  return rucksacksList.split("\n").reduce((sumOfPriorities, rucksack) => {
    const centerIndex = rucksack.length / 2;
    const [compartment1, compartment2] = [
      rucksack.slice(0, centerIndex),
      rucksack.slice(centerIndex),
    ];

    for (const item of compartment1.split("")) {
      if (compartment2.includes(item)) {
        return sumOfPriorities + getItemPriority(item);
      }
    }
    return sumOfPriorities;
  }, 0);
}

console.log("Result", checkRucksacks(data));

const avgTime = averageTimeSync(1000, () => checkRucksacks(data));
console.log("Avg time", avgTime);
