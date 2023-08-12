/*
--- Part Two ---
Your device's communication system is correctly detecting packets, but still isn't working. It looks like it also needs to look for messages.

A start-of-message marker is just like a start-of-packet marker, except it consists of 14 distinct characters rather than 4.

Here are the first positions of start-of-message markers for all of the above examples:

mjqjpqmgbljsphdztnvjfqwrcgsmlb: first marker after character 19
bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 23
nppdvjthqldpwncqszvftbrmjlhg: first marker after character 23
nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 29
zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 26
How many characters need to be processed before the first start-of-message marker is detected?
*/
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MessageMarkerDetector } from "./common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markerDetector = new MessageMarkerDetector(
  14,
  path.resolve(__dirname, "input_data"),
);

markerDetector
  .on("end", (possibleMarker) =>
    console.log(possibleMarker ? "succcess!" : "No marker has been found!"),
  )
  .on("marker-detected", (marker) => console.log("Marker detected", marker))
  .run();
