const { max, min } = Math;

function calc1(input) {
  let diceIndex = 0;
  const rollDice = () => {
    const res = diceIndex + 1;
    diceIndex = (diceIndex + 1) % 100;
    return res;
  };
  const rnd = () => rollDice() + rollDice() + rollDice();
  let p1 = 0;
  let p2 = 0;
  let t = 0;
  let [n1, n2] = input.map((d) => d - 1);
  while (p1 < 1000 && p2 < 1000) {
    const r = rnd();
    if (t++ % 2 === 0) {
      n1 = (n1 + r) % 10;
      p1 += n1 + 1;
    } else {
      n2 = (n2 + r) % 10;
      p2 += n2 + 1;
    }
  }
  return 3 * t * min(p1, p2);
}

function nextStates(s) {
  const res = [];
  const rs = [
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1],
  ];
  for (const r of rs) {
    let [c, t, n1, n2, p1, p2, u] = s;
    if (t % 2 === 0) {
      n1 = (n1 + r[0]) % 10;
      p1 += n1 + 1;
      if (p1 >= 21) {
        u = 1;
      }
    } else {
      n2 = (n2 + r[0]) % 10;
      p2 += n2 + 1;
      if (p2 >= 21) {
        u = -1;
      }
    }
    res.push([c * r[1], t + 1, n1, n2, p1, p2, u]);
  }
  return res;
}

function calc2(input) {
  const p1 = 0;
  const p2 = 0;
  const t = 0;
  const [n1, n2] = input.map((d) => d - 1);
  const s0 = [1, t, n1, n2, p1, p2, 0];
  const queue = [s0];
  let w1 = 0;
  let w2 = 0;
  while (queue.length > 0) {
    const q = queue.pop();
    const ns = nextStates(q);
    for (const n of ns) {
      if (n[6] !== 0) {
        if (n[6] === 1) {
          w1 += n[0];
        } else {
          w2 += n[0];
        }
      } else {
        queue.push(n);
      }
    }
  }
  return max(w1, w2);
}

export default function (inputRows) {
  const input = inputRows.map((r) => Number(r.replace(/Player [12] starting position: /, "")));
  return [calc1(input), calc2(input)];
}
