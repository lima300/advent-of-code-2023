const { readFileSync } = require("fs");

// Function to parse the input and return an array of grids
function parse(input) {
  return input
    .trim()
    .split(/\n{2,}/)
    .map((chunk) => {
      const lines = chunk.split("\n");
      const grid = Array.from({ length: lines.length }, (_, y) => {
        return Array.from({ length: lines[0].length }, (_, x) => lines[y][x]);
      });
      return grid;
    });
}

// Function to find the intersection of two sets
function intersect(a, b) {
  const intersection = new Set();
  for (const v of a) {
    if (b.has(v)) intersection.add(v);
  }
  for (const v of b) {
    if (a.has(v)) intersection.add(v);
  }
  return intersection;
}

// Function to check if a line is a reflection
function isReflection(line, a) {
  let b = a + 1;
  do {
    if (line[a] === line[b]) {
      b++;
      a--;
      continue;
    } else {
      return false;
    }
  } while (b < line.length && a >= 0);
  return true;
}

// Function to find indexes where the line can be reflected
function findLineReflections(line) {
  const indexes = new Set();
  for (let i = 0; i < line.length; i++) {
    if (isReflection(line, i)) {
      indexes.add(i);
    }
  }
  return indexes;
}

// Function to find the common reflection index across all the lines
function findVerticalReflection(lines, exclude) {
  let acc = findLineReflections(lines[0]);
  for (const line of lines) {
    acc = intersect(acc, findLineReflections(line));
  }

  acc.delete(exclude);

  if (acc.size !== 0 && acc.size !== 1) {
    throw new Error(`unexpected acc: ${acc}`);
  }

  return acc.size === 1 ? acc.values().next().value : -1;
}

// Function to transpose a grid
function transpose(grid) {
  return Array.from({ length: grid[0].length }, (_, y) =>
    Array.from({ length: grid.length }, (_, x) => grid[x][y])
  );
}

// Function to find horizontal reflection
function findHorizontalReflection(lines, exclude) {
  return findVerticalReflection(transpose(lines), exclude);
}

// Function to summarize the grid
function summarize(lines) {
  const cols = findVerticalReflection(lines, -1) + 1;
  const rows = findHorizontalReflection(lines, -1) + 1;
  return cols + 100 * rows;
}

// Generator function for smudge permutations
function* smudgePermutations(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const copy = JSON.parse(JSON.stringify(grid));
      copy[y][x] = grid[y][x] === "#" ? "." : "#";
      yield copy;
    }
  }
}

// Function to find the smudge alternate score
function findSmudgeAlternateScore(grid) {
  const v = findVerticalReflection(grid, -1);
  const h = findHorizontalReflection(grid, -1);

  for (const alt of smudgePermutations(grid)) {
    const av = findVerticalReflection(alt, v);
    const ah = findHorizontalReflection(alt, h);
    if (av !== v && av !== -1) {
      return av + 1;
    } else if (ah !== h && ah !== -1) {
      return 100 * (ah + 1);
    }
  }

  return 0;
}

// Input string
let input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

// Read input from file (uncomment the line below if needed)
input = readFileSync("input13.txt", { encoding: "utf8" });

// Function for part 1
function part1(input) {
  const grids = parse(input);
  return parse(input).reduce((acc, grid) => acc + summarize(grid), 0);
}

// Function for part 2
function part2(input) {
  return parse(input).reduce(
    (acc, grid) => acc + findSmudgeAlternateScore(grid),
    0
  );
}

// Print results
console.log("part 1:", part1(input), part1(input) === 34993);
console.log("part 2:", part2(input), part2(input) === 29341);
