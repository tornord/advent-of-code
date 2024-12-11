import { sum, countBy } from "../../../common";

function addToDict(dict, key, value) {
  if (dict[key] === undefined) {
    dict[key] = value;
  } else {
    dict[key] += value;
  }
}

function calc(input, nTimes) {
  let stoneDict = countBy(input);
  for (let i = 0; i < nTimes; i++) {
    let newStoneDict = {};
    for (let [k, v] of Object.entries(stoneDict)) {
      if (k === "0") {
        addToDict(newStoneDict, "1", v);
        continue;
      }
      let n = k.length;
      if (n % 2 === 0) {
        let k1 = Number(k.slice(0, n / 2));
        let k2 = Number(k.slice(n / 2));
        addToDict(newStoneDict, k1, v);
        addToDict(newStoneDict, k2, v);
        continue;
      }
      addToDict(newStoneDict, String(2024 * Number(k)), v);
    }
    stoneDict = newStoneDict;
  }
  return sum(Object.values(stoneDict));
}

export default function (inputRows, name) {
  let input = inputRows.map((r) => r.split(/ /g))[0];
  let n = name === "example.txt" ? 6 : 25;
  return [calc(input, n), calc(input, 75)];
}
