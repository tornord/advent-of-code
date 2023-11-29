function calc1(input) {
  const r0 = input[0];
  const p = { x: 0, y: 0 };
  const dir = { x: 0, y: 1 };
  for (let i = 0; i < r0.length; i++) {
    if (r0[i] === "|") {
      p.x = i;
      break;
    }
  }
  const cs = [];
  let n = 0;
  while (n < 100_000) {
    const c = input[p.y][p.x];
    if (c === " ") break;
    if (c === "+") {
      if (dir.x === 0) {
        if (input[p.y][p.x - 1] !== " ") {
          dir.x = -1;
          dir.y = 0;
        } else {
          dir.x = 1;
          dir.y = 0;
        }
      } else {
        if (input[p.y - 1][p.x] !== " ") {
          dir.x = 0;
          dir.y = -1;
        } else {
          dir.x = 0;
          dir.y = 1;
        }
      }
    } else if (c !== "-" && c !== "|") {
      cs.push(c);
    }
    p.x += dir.x;
    p.y += dir.y;
    n++;
  }
  return [cs.join(""), n];
}

export default function (inputRows) {
  const input = inputRows;
  return calc1(input);
}
