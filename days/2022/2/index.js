export default function (inputRows) {
  const res1 = { AX: 4, AY: 8, AZ: 3, BX: 1, BY: 5, BZ: 9, CX: 7, CY: 2, CZ: 6 };
  const res2 = { AX: 3, AY: 4, AZ: 8, BX: 1, BY: 5, BZ: 9, CX: 2, CY: 6, CZ: 7 };
  const s = [0, 0];
  for (const d of inputRows) {
    const dd = d.replace(" ", "");
    s[0] += res1[dd];
    s[1] += res2[dd];
  }
  return s;
}
