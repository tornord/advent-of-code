import { sum } from "../../../common";

function decompress(msg) {
  const { s, x } = msg;
  const msgs = [];
  let size = 0;
  if (s.match(/\((\d+)x(\d+)\)/)) {
    let r = s;
    while (r.length > 0) {
      const m = r.match(/^\((\d+)x(\d+)\)/);
      if (!m) {
        msgs.push({ s: r[0], x: x });
        r = r.slice(1);
      } else {
        const n = Number(m[1]);
        const times = Number(m[2]);
        const mm = m[0].length;
        r = r.slice(mm);
        const ss = r.slice(0, n);
        msgs.push({ s: ss, x: times * x });
        r = r.slice(n);
      }
    }
  } else {
    size = s.length * x;
  }
  return { size, msgs };
}

function calc1(input) {
  const dec = decompress({ s: input[0], x: 1 });
  return dec.size + sum(dec.msgs.map((d) => d.s.length * d.x));
}

function calc2(input) {
  let size = 0;
  const queue = [{ s: input[0], x: 1 }];
  while (queue.length > 0) {
    const q = queue.pop();
    const res = decompress(q);
    queue.push(...res.msgs);
    size += res.size;
  }
  return size;
}

export default function (inputRows) {
  return [calc1(inputRows), calc2(inputRows)];
}
