export default function (inputRows) {
  const rows = inputRows.map((d) => Number(d));
  let res1 = 0;
  let res2 = 0;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    res1 += r > rows[i - 1] ? 1 : 0;
    res2 += i >= 3 && r > rows[i - 3] ? 1 : 0;
  }
  return [res1, res2];
}
