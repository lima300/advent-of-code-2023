const fs = require("fs");

// Read the content of the input file and split it into an array of lines
const fileContent = fs.readFileSync("input3.txt", "utf-8");
const lines = fileContent.trim().split("\n");

const box = [-1, 0, 1];
const partsBySymbol = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const x = line[j];
    if (x !== "." && !/\d/.test(x)) {
      partsBySymbol[`${i},${j}`] = [x, []];
    }
  }
}

let partSum = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const matches = line.match(/\d+/g);
  if (matches) {
    for (const match of matches) {
      const n = parseInt(match);
      const boundary = new Set();
      for (const di of box) {
        for (const dj of box) {
          for (
            let j = line.indexOf(match);
            j < line.indexOf(match) + match.length;
            j++
          ) {
            boundary.add(`${i + di},${j + dj}`);
          }
        }
      }

      if (Object.keys(partsBySymbol).some((symbol) => boundary.has(symbol))) {
        partSum += n;
      }

      for (const symbol of Object.keys(partsBySymbol).filter((symbol) =>
        boundary.has(symbol)
      )) {
        partsBySymbol[symbol][1].push(n);
      }
    }
  }
}

// Part 1
console.log(partSum);

// Part 2
const part2Sum = Object.values(partsBySymbol)
  .filter(([symbol, parts]) => parts.length === 2 && symbol === "*")
  .reduce((sum, [, parts]) => sum + parts[0] * parts[1], 0);

console.log(part2Sum);
