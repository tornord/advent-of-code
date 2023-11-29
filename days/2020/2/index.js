import { countBy } from "../../../common";

export default function (inputRows) {
  const rows = inputRows.map((r) => r.split(/[-]|: | /g));
  const res = [0, 0];
  for (const [mn, mx, c, pw] of rows) {
    const cs = countBy(pw.split(""));
    if (cs[c] >= mn && cs[c] <= mx) {
      res[0]++;
    }
    if ((pw[mn - 1] === c && pw[mx - 1] !== c) || (pw[mn - 1] !== c && pw[mx - 1] === c)) {
      res[1]++;
    }
  }
  return res;
}
