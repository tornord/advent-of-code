import { countBy, sum } from "../../../common";

export default function (inputRows) {
  let n1 = 0;
  let n2 = 0;
  for (let y = 0; y < inputRows.length; y++) {
    const r = inputRows[y];
    const charCounts = countBy(r.split(""));
    const nVowels = sum("aeiou".split("").map((d) => (typeof charCounts[d] === "number" ? charCounts[d] : 0)));
    let hasTwoInARow = false;
    const ps = [];
    for (let i = 0; i < r.length - 1; i++) {
      ps.push(r.slice(i, i + 2));
      if (r[i] === r[i + 1]) {
        hasTwoInARow = true;
      }
    }
    const pairCounts = countBy(ps);
    const nForbiddenPairs = sum(
      ["ab", "cd", "pq", "xy"].map((d) => (typeof pairCounts[d] === "number" ? pairCounts[d] : 0))
    );

    let hasDoublePair = false;
    for (let i = 0; i < r.length - 3; i++) {
      for (let j = i + 2; j < r.length - 1; j++) {
        if (r.slice(i, i + 2) === r.slice(j, j + 2)) {
          hasDoublePair = true;
          break;
        }
      }
    }
    let hasOneLetterBetween = false;
    for (let i = 0; i < r.length - 2; i++) {
      if (r[i] === r[i + 2]) {
        hasOneLetterBetween = true;
        break;
      }
    }
    n1 += nVowels >= 3 && hasTwoInARow && nForbiddenPairs === 0 ? 1 : 0;
    n2 += hasDoublePair && hasOneLetterBetween ? 1 : 0;
  }
  return [n1, n2];
}
