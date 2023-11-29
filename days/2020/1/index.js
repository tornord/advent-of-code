import { prod } from "../../../common";

function calc1(rows) {
  let res = null;
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      if (rows[i] + rows[j] === 2020) {
        res = [rows[i], rows[j]];
        break;
      }
    }
    if (res) break;
  }
  return prod(res);
}

function calc2(rows) {
  let res = null;
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      for (let k = j + 1; k < rows.length; k++) {
        if (rows[i] + rows[j] + rows[k] === 2020) {
          res = [rows[i], rows[j], rows[k]];
          break;
        }
      }
      if (res) break;
    }
    if (res) break;
  }
  return prod(res);
}

export default function (inputRows) {
  const rows = inputRows.map(Number);
  return [calc1(rows), calc2(rows)];
}
