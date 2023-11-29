import { sum } from "../../../common";

function calc2(rows, mix, n) {
  const ny = rows.length;
  let workRows = rows.slice().map((d) => d * mix);

  workRows = workRows.map((d, i) => [d, i]);
  for (let k = 0; k < n; k++) {
    for (let y = 0; y < ny; y++) {
      let currIdx = workRows.findIndex((d) => d[1] === y);
      const [r, idx] = workRows[currIdx];
      if (r === 0) continue;
      workRows.splice(currIdx, 1);
      let newIdx;
      if (r > 0) {
        newIdx = (r + currIdx) % (ny - 1);
      } else {
        while (r + currIdx < 0) {
          currIdx += 1000 * 811589153 * (ny - 1);
        }
        newIdx = (r + currIdx) % (ny - 1);
        if (newIdx === 0) {
          newIdx = ny - 1;
        }
      }
      workRows.splice(newIdx, 0, [r, idx]);
    }
  }
  workRows = workRows.map((d) => d[0]);
  const zeroIdx = workRows.findIndex((d) => d === 0);
  const code = [1000, 2000, 3000].map((d) => workRows[(zeroIdx + d) % ny]);
  return sum(code);
}

export default function (inputRows) {
  return [calc2(inputRows, 1, 1), calc2(inputRows, 811589153, 10)];
}
