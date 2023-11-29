function calcCycles(blocks, stopCondition = (key, dict) => dict[key]) {
  let i = 0;
  const dict = {};
  dict[blocks.join(",")] = true;
  while (i++ < 1000000) {
    const ss = blocks.map((d, _i) => ({ i: _i, d })).sort((a, b) => (b.d === a.d ? a.i - b.i : b.d - a.d));
    const b = ss[0];
    const n = b.d;
    blocks[b.i] = 0;
    for (let j = 0; j < n; j++) {
      blocks[(b.i + j + 1) % blocks.length]++;
    }
    const key = blocks.join(",");
    if (stopCondition(key, dict)) {
      break;
    }
    dict[key] = true;
  }
  return { n: i, blocks };
}

function calc1(input) {
  const blocks = [...input[0]];
  const { n } = calcCycles(blocks);
  return n;
}

function calc2(input) {
  const blocks = [...input[0]];
  const { blocks: bs } = calcCycles(blocks);
  const startKey = bs.join(",");
  const { n } = calcCycles(bs, (key) => key === startKey);
  return n;
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/[ \t]/g).map(Number));
  return [calc1(input), calc2(input)];
}
