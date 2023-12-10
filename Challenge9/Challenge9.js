const fs = require("fs");

const history = fs.readFileSync("input9.txt", "utf8").split("\n");

function lagrange1(nums) {
  const n = nums.length;
  let res = 0;

  for (let i = 0; i < n; i++) {
    res += nums[i] * binomialCoefficient(n, i) * Math.pow(-1, n - 1 - i);
  }

  return res;
}

function lagrange2(nums) {
  const n = nums.length;
  let res = 0;

  for (let i = 0; i < n; i++) {
    res += nums[i] * binomialCoefficient(n, i + 1) * Math.pow(-1, i);
  }

  return res;
}

function binomialCoefficient(n, k) {
  if (k === 0 || k === n) {
    return 1;
  }

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - i + 1) / i;
  }

  return Math.round(result);
}

let res1 = 0,
  res2 = 0;

for (let i = 0; i < history.length; i++) {
  const nums = history[i].trim().split(" ").map(Number);
  res1 += lagrange1(nums);
  res2 += lagrange2(nums);
}

console.log(res1, res2);
