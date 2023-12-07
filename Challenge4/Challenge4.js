const fs = require("fs");

// Read the content of the input file and split it into an array of lines
const fileContent = fs.readFileSync("input4.txt", "utf-8");
const lines = fileContent.trim().split("\n");

const ns = lines.map((x) => x.match(/\d+/g).map(Number));
const wins = ns.map((n) => {
  const a = new Set(n.slice(11));
  const b = new Set(n.slice(1, 11));
  return [...new Set([...a].filter((x) => b.has(x)))].length;
});

// Part 1
const part1Sum = wins
  .filter((w) => w > 0)
  .reduce((sum, w) => sum + 2 ** (w - 1), 0);
console.log(part1Sum);

// Part 2
let cards = new Array(ns.length).fill(1);

for (let i = 0; i < cards.length; i++) {
  for (let j = i + 1; j < i + wins[i] + 1; j++) {
    cards[j] += cards[i];
  }
}

console.log(cards.reduce((sum, card) => sum + card, 0));

// // Part 2 again, but considering the game as a nilpotent evolution for no real reason
// const N = ns.length;
// const mat = Array.from({ length: N }, (_, i) =>
//   Array.from({ length: N }, (_, j) => (j > i && j <= i + wins[i] ? 1 : 0))
// );

// const invMat = inv(mat);
// const onesVector = Array.from({ length: N }, () => 1);
// const result = matMul(invMat, onesVector);
// console.log(result.reduce((sum, value) => sum + value, 0));
