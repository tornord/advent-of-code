function calc(input, jmpOffsetAdj = (c) => c + 1) {
  let c = 0;
  let i = 0;
  while (c >= 0 && c < input.length) {
    const cn = c + input[c];
    input[c] = jmpOffsetAdj(input[c]);
    c = cn;
    i++;
  }
  return i;
}

export default function (inputRows) {
  const input = inputRows.map((r) => Number(r));
  return [calc([...input]), calc([...input], (c) => c + (c >= 3 ? -1 : 1))];
}
