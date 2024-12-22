import { toDict } from "@common";

test("parse", () => {
  expect(parsed.length).toEqual(inputRows[0].length);
  const dict = toDict(parsed, (d) => d, true);
  expect(Object.keys(dict).length).toEqual(2);
});