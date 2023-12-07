const fs = require("fs");

// Read the content of the input file and split it into an array of lines
const fileContent = fs.readFileSync("input2.txt", "utf-8");
const lines = fileContent.trim().split("\n");

let goodIds = 0;
let totalPower = 0;

for (const line of lines) {
  const parts = line.replace(/[;,:]/g, "").split(/\s+/);
  const colormax = {};

  for (let i = 2; i < parts.length; i += 2) {
    const count = parseInt(parts[i]);
    const color = parts[i + 1];
    colormax[color] = Math.max(colormax[color] || 0, count);
  }

  if (
    colormax["red"] <= 12 &&
    colormax["green"] <= 13 &&
    colormax["blue"] <= 14
  ) {
    goodIds += parseInt(parts[1]);
  }

  totalPower += Object.values(colormax).reduce((acc, value) => acc * value, 1);
}

// Part 1
console.log(goodIds);

// Part 2
console.log(totalPower);
