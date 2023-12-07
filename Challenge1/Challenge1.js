const fs = require("fs");

const data = fs.readFileSync("input.txt", "utf8").trim();

function calibration(data) {
  const ls = data.split("\n");
  const ns = ls.map((x) => x.match(/\d/g));
  return ns.reduce((sum, n) => sum + parseInt(n[0] + n[n.length - 1]), 0);
}

// Part 1
console.log(calibration(data));

// Part 2
const modifiedData = data
  .replace(/one/g, "one1one")
  .replace(/two/g, "two2two")
  .replace(/three/g, "three3three")
  .replace(/four/g, "four4four")
  .replace(/five/g, "five5five")
  .replace(/six/g, "six6six")
  .replace(/seven/g, "seven7seven")
  .replace(/eight/g, "eight8eight")
  .replace(/nine/g, "nine9nine");

console.log(calibration(modifiedData));
