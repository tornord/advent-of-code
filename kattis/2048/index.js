const rs = [];
let line;

while ((line = readline())) {
  rs.push(line);
}

const board = [];
for (let i = 0; i < 4; i++) board.push(rs[i].split(" ").map((d) => parseInt(d)));

function packLine(lne, dir) {
  const res = [0, 0, 0, 0];
  let last = -1;
  const i0 = 1.5 * (1 - dir);
  let j = i0;
  for (let i = i0; i >= 0 && i <= 3; i += dir) {
    const y = lne[i];
    if (y === 0) continue;
    if (y === last) {
      res[j - dir] += y;
      last = -1;
    } else {
      res[j] = y;
      last = y;
      j += dir;
    }
  }
  return res;
}

const d = parseInt(rs[4]);
let dir = 1;
if (d >= 2) dir = -1;
for (let i = 0; i < 4; i++) {
  let x;
  if (d === 0 || d === 2) x = board[i];
  else x = board.map((e) => e[i]);
  const y = packLine(x, dir);
  if (d === 0 || d === 2) board[i] = y;
  else for (let j = 0; j < 4; j++) board[j][i] = y[j];
}
for (let i = 0; i < 4; i++) {
  print(board[i].join(" "));
}
