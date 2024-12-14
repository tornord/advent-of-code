test("parse", () => {
  expect(parsed.length).toEqual(inputRows.length);
  expect(parsed.every((r) => r.length === 3 && r.every((c) => typeof c === "number"))).toEqual(true);
});
