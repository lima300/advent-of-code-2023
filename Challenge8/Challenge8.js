const fs = require("fs");

const input = fs.readFileSync("input8.txt", "utf8").split("\n");
const instructions = input[0].trim();
const nodes = Object.fromEntries(
  input.slice(2).map((line) => {
    const match = line.match(/\w+/g);
    return [match[0], [match[1], match[2]]];
  })
);

function numSteps(pos, endPred) {
  let steps = 0;

  while (true) {
    for (const inst of instructions) {
      steps += 1;
      pos = nodes[pos][inst === "L" ? 0 : 1];
      if (endPred(pos)) {
        return steps;
      }
    }
  }
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

console.log(
  "1:",
  numSteps("AAA", (p) => p === "ZZZ")
);
console.log(
  "2:",
  Object.keys(nodes)
    .filter((p) => p.endsWith("A"))
    .map((p) => numSteps(p, (p) => p.endsWith("Z")))
    .reduce(lcm)
);
