import { reduceSet, sum, transpose, unionSet } from "../../../common";

const bingo = (rs, ns) => rs.every((r) => ns.findIndex((d) => d === r) >= 0);

function calc(rows, waitLast = false) {
  const ns = rows[0].split(",");
  const boards = [];
  for (let i = 2; i < rows.length; i += 6) {
    const rs = rows.slice(i, i + 5).map((d) => d.trim().split(/ +/));
    rs.push(...transpose(rs));
    boards.push({ rows: rs, all: unionSet(...rs), succ: false });
  }
  let s = null;
  let nf = null;
  for (let i = 0; i < ns.length; i++) {
    for (const b of boards) {
      const nn = ns.slice(0, i + 1);
      if (b.rows.some((r) => bingo(r, nn))) {
        b.succ = true;
        if (waitLast && !boards.every((d) => d.succ === true)) continue;
        s = sum(reduceSet(b.all, nn).map(Number));
        break;
      }
    }
    if (s !== null) {
      nf = ns[i];
      break;
    }
  }
  return s * Number(nf);
}

export default function (inputRows) {
  return [calc(inputRows), calc(inputRows, true)];
}
