import { readFileSync } from "fs";
export type range = [number, number];
export class AlmanacMap {
  name: string;
  mappings: Mapping[];
  constructor(name: string, mappings: Mapping[]) {
    this.name = name;
    this.mappings = mappings;
  }
  map(source: number): number {
    for (const m of this.mappings) {
      const v = m.map(source);
      if (v !== undefined) {
        return v;
      }
    }
    return source;
  }
  mapRange(range: range): range[] {
    let result: range[] = [];
    let toMap = [range];

    for (let m of this.mappings) {
      let next: range[] = [];
      toMap.forEach((tm) => {
        const [before, mapped, after] = m.mapRange(tm);

        if (before) {
          next.push(before);
        }
        if (mapped) {
          result.push(mapped);
        }
        if (after) {
          next.push(after);
        }
      });
      toMap = next;
    }

    // and finally, anything that wasn't mapped ends up mapping to itself
    result.push(...toMap);
    return result;
  }
}

export class Mapping {
  source: number;
  dest: number;
  length: number;
  constructor(source: number, dest: number, length: number) {
    this.source = source;
    this.dest = dest;
    this.length = length;
  }

  map(source: number): number | undefined {
    const diff = source - this.source;
    if (diff >= 0 && diff < this.length) {
      return this.dest + diff;
    }
  }
  mapRange(range: range) {
    let before: range | undefined;
    let mapped: range | undefined;
    let after: range | undefined;
    const [start, end] = [this.source, this.source + this.length - 1];

    // before
    if (start > range[0]) {
      before = [range[0], Math.min(start - 1, range[1])];
    }

    // intersect
    if (start <= range[1] && end >= range[0]) {
      let s = this.map(Math.max(start, range[0]))!;
      let e = this.map(Math.min(end, range[1]))!;
      mapped = [s, e];
    }

    // after
    if (end < range[1]) {
      after = [Math.max(end + 1, range[0]), range[1]];
    }

    // console.log(`[${range}] => [${start},${end}]: [${before ?? ''}] [${mapped ?? ''}] [${after ?? ''}]`)

    return [before, mapped, after];
  }
}

function parseSeeds(line: string): number[] {
  return line
    .split(/\s+/)
    .slice(1)
    .map((s: string) => parseInt(s));
}

function parseMap(line: string): Mapping {
  const [dest, source, length] = line.split(" ").map((v) => parseInt(v));
  return new Mapping(source, dest, length);
}

function parseMaps(parts: string[]) {
  return parts.map((p) => {
    const [label, ...mappings] = p.split("\n");
    return new AlmanacMap(label, mappings.map(parseMap));
  });
}

function part1(parts: string[]) {
  const seeds = parseSeeds(parts[0]);
  const almanacMaps = parseMaps(parts.slice(1));
  let lowest = Number.MAX_SAFE_INTEGER;
  seeds.forEach((seed) => {
    let location = seed;
    almanacMaps.forEach((am) => {
      location = am.map(location);
    });
    lowest = location < lowest ? location : lowest;
  });

  console.log(`Part 1: ${lowest}`);
}

function part2(parts: string[]) {
  const seeds = parseSeeds(parts[0]);
  const almanacMaps = parseMaps(parts.slice(1));

  let lowest = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < seeds.length; i += 2) {
    let ranges: range[] = [[seeds[i], seeds[i] + seeds[i + 1] - 1]];
    for (let am of almanacMaps) {
      ranges = ranges.map((r) => am.mapRange(r)).flat();
    }
    ranges.forEach((r) => {
      lowest = lowest > r[0] ? r[0] : lowest;
    });
  }

  console.log(`Part 2: ${lowest}`);
}

console.time("Elapsed time");
const parts = readFileSync("input5.txt").toString().trim().split("\n\n");
part1(parts);
part2(parts);
console.timeEnd("Elapsed time");
