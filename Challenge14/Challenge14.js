const fs = require("fs");

function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}

function solve() {
  const inputPath = `input14.txt`;
  return {
    part1: solvePart1(readInput(inputPath)),
    part2: solvePart2(readInput(inputPath)),
  };
}

function readInput(inputFilePath) {
  const input = fs.readFileSync(inputFilePath, "utf-8");
  return input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((n) => n.split(""));
}

function solvePart1(pattern) {
  const roundedRocks = findRoundedRocks(pattern);
  const { shiftedRocks } = shiftRocks(pattern, roundedRocks, "N");
  return getLoad(pattern.length, shiftedRocks);
}

function findRoundedRocks(pattern) {
  return reducePattern(
    pattern,
    (roundedRocks, symbol, rowIdx, colIdx) => {
      if (symbol === "O") {
        roundedRocks.push({ y: rowIdx, x: colIdx });
      }
      return roundedRocks;
    },
    []
  );
}

function shiftRocks(pattern, roundedRocks, direction) {
  const shiftedRocks = [];

  let currentPattern = pattern;
  for (let i = 0; i < roundedRocks.length; i++) {
    const { x, y } = roundedRocks[i];
    const { pattern: newPattern, shiftedRock } = slideRock(
      currentPattern,
      {
        x,
        y,
      },
      direction
    );
    currentPattern = newPattern;
    shiftedRocks.push(shiftedRock);
  }

  return { pattern, shiftedRocks };
}

function slideRock(pattern, rock, direction) {
  const dimension = ["N", "S"].includes(direction) ? "y" : "x";
  const shiftedRock = { ...rock };

  const getNextCounter = (i) => {
    if (direction === "N") return i - 1;
    if (direction === "W") return i - 1;
    if (direction === "S") return i + 1;
    return i + 1;
  };

  const getPrevCounter = (i) => {
    if (direction === "N") return i + 1;
    if (direction === "W") return i + 1;
    if (direction === "S") return i - 1;
    return i - 1;
  };

  const getNextSymbol = (i) => {
    if (
      i === -1 ||
      i > (dimension === "y" ? pattern.length - 1 : pattern[0].length - 1)
    ) {
      return undefined;
    }
    return dimension === "y" ? pattern[i][rock.x] : pattern[rock.y][i];
  };

  let i = getNextCounter(rock[dimension]);
  while (true) {
    const nextSymbol = getNextSymbol(i);

    if (nextSymbol !== ".") {
      shiftedRock[dimension] = getPrevCounter(i);

      if (shiftedRock[dimension] !== rock[dimension]) {
        pattern[shiftedRock.y][shiftedRock.x] = "O";
        pattern[rock.y][rock.x] = ".";
      }

      return { pattern, shiftedRock };
    }

    i = getNextCounter(i);
  }
}

function getLoad(patternLength, shiftedRocks) {
  const getRockLoad = (rock) => patternLength - rock.y;
  return sum(shiftedRocks.map(getRockLoad));
}

function reducePattern(pattern, callback, initialAcc) {
  let acc = initialAcc;
  for (let rowIdx = 0; rowIdx < pattern.length; rowIdx++) {
    for (let colIdx = 0; colIdx < pattern[rowIdx].length; colIdx++) {
      acc = callback(acc, pattern[rowIdx][colIdx], rowIdx, colIdx);
    }
  }
  return acc;
}

function solvePart2(inputPattern) {
  const inputRocks = findRoundedRocks(inputPattern);
  const NUM_OF_CYCLES = 1_000_000_000;

  let cycleResult = {
    pattern: inputPattern,
    rocks: inputRocks,
  };

  const resultsCount = new Map();

  while (true) {
    cycleResult = runCycle(cycleResult);

    const resultStringified = JSON.stringify(cycleResult);
    if (!resultsCount.has(resultStringified)) {
      resultsCount.set(resultStringified, 1);
      continue;
    }

    if (resultsCount.get(resultStringified) === 1) {
      resultsCount.set(resultStringified, 2);
      continue;
    }

    break;
  }

  const repeatedResults = [];
  for (let [resultStringified, count] of resultsCount) {
    if (count === 2) {
      repeatedResults.push(JSON.parse(resultStringified));
    }
  }

  const offset = resultsCount.size - repeatedResults.length;
  const goalResultIndex =
    ((NUM_OF_CYCLES - offset) % repeatedResults.length) - 1;
  const { pattern, rocks } = repeatedResults[goalResultIndex];

  return getLoad(pattern.length, rocks);
}

function runCycle({ pattern, rocks }) {
  let currentPattern = clonePattern(pattern);
  let currentRocks = cloneRocks(rocks);

  ["N", "W", "S", "E"].forEach((direction) => {
    const { pattern, shiftedRocks } = shiftRocks(
      currentPattern,
      sortRocks(currentRocks, direction),
      direction
    );
    currentPattern = pattern;
    currentRocks = shiftedRocks;
  });

  return { pattern: currentPattern, rocks: currentRocks };
}

function sortRocks(rocks, direction) {
  if (direction === "N") return rocks.sort((a, b) => a.y - b.y);
  if (direction === "S") return rocks.sort((a, b) => b.y - a.y);
  if (direction === "W") return rocks.sort((a, b) => a.x - b.x);
  return rocks.sort((a, b) => b.x - a.x);
}

function clonePattern(pattern) {
  return pattern.map((row) => [...row]);
}

function cloneRocks(rocks) {
  return rocks.map((r) => ({ ...r }));
}

const solution = solve();
console.log(solution);
