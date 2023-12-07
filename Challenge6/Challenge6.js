const fs = require("fs");

// Read the content of the input file and split it into an array of lines
const fileContent = fs.readFileSync("input6.txt", "utf-8");
const lines = fileContent.trim().split("\n");

const times = lines[0]
  .split(":")[1]
  .split(" ")
  .filter((entry) => entry !== "");

const distances = lines[1]
  .split(":")[1]
  .split(" ")
  .filter((entry) => entry !== "");

let result = 1;

const countWins = (time, distance) => {
  let wins = 0;
  for (let j = 0; j < time; j++) {
    if (j * (time - j) > distance) {
      wins++;
    }
  }
  return wins;
};

times.forEach((entry, index) => {
  result *= countWins(parseInt(entry), distances[index]);
});

console.log(result);

//part 2
const time = parseInt(times.join(""));
const distance = parseInt(distances.join(""));
console.log(countWins(time, distance));
