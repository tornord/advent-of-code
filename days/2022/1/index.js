import { splitArray, sum } from "../../../common";

export default function (inputRows) {
  const ms = splitArray(inputRows).map((d) => sum(d.map(Number)));
  ms.sort((d1, d2) => d2 - d1);
  return [ms[0], sum(ms.slice(0, 3))];
}
