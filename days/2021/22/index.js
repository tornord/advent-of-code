import { strict as assert } from "node:assert";

import { prod, sum } from "../../../common";

function overlaps(block1, block2) {
  for (let i = 0; i < block1.length; i++) {
    const [v10, v11] = block1[i];
    const [v20, v21] = block2[i];
    if (v21 < v10 || v20 > v11) return false;
  }
  return true;
}
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[10, 12], [10, 12], [10, 12]]), true); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[13, 15], [13, 15], [13, 15]]), false); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[9, 13], [13, 15], [13, 15]]), false); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[12, 15], [12, 15], [13, 15]]), false); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[9, 10], [9, 10], [13, 15]]), false); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[9, 10], [9, 10], [12, 13]]), true); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[9, 13], [9, 13], [9, 13]]), true); // prettier-ignore
assert.deepEqual(overlaps([[10, 12], [10, 12], [10, 12]], [[11, 11], [11, 11], [11, 11]]), true); // prettier-ignore

function cutBlock1D(b, dim, vs) {
  const [v0, v1] = vs;
  const [b0, b1] = b[dim];
  if (b1 <= v0 || b0 >= v1) return null;
  const r0 = b.map((d) => d.slice());
  r0[dim][1] = v0;
  const r1 = b.map((d) => d.slice());
  r1[dim][0] = v1;
  return [r0, r1];
}
assert.deepEqual(cutBlock1D([[0, 4], [6, 8]], 1, [8, 9]), null); // prettier-ignore
assert.deepEqual(cutBlock1D([[0, 4], [6, 8]], 1, [5, 6]), null); // prettier-ignore
assert.deepEqual(cutBlock1D([[0, 4], [6, 8]], 0, [5, 6]), null); // prettier-ignore
assert.deepEqual(cutBlock1D([[0, 4], [6, 8]], 0, [2, 3]), [[[0, 2], [6, 8]], [[3, 4], [6, 8]]]); // prettier-ignore

function cutBlock(objBlock, fromBlock) {
  let res = [objBlock];
  for (let dim = 0; dim < objBlock.length; dim++) {
    const res1 = [];
    for (const b of res) {
      const vs = fromBlock[dim];
      const r1 = cutBlock1D(b, dim, [vs[0] - 1, vs[0]]) ?? [b];
      const [rn] = r1.splice(-1, 1);
      r1.push(...(cutBlock1D(rn, dim, [vs[1], vs[1] + 1]) ?? [rn]));
      res1.push(...r1);
    }
    res = res1;
  }
  return res;
}
assert.deepEqual(cutBlock([[0, 4], [6, 8]], [[5, 6], [6, 8]]), [[[0, 4], [6, 8]]]); // prettier-ignore
assert.deepEqual(cutBlock([[0, 4], [6, 8]], [[4, 5], [6, 8]]), [[[0, 3], [6, 8]], [[4, 4], [6, 8]]]); // prettier-ignore
assert.deepEqual(cutBlock([[0, 4], [6, 8]], [[1, 3], [6, 8]]), [[[0, 0], [6, 8]], [[1, 3], [6, 8]], [[4, 4], [6, 8]]]); // prettier-ignore
assert.deepEqual(cutBlock([[0, 3], [0, 4]], [[2, 5], [1, 3]]), [[[0, 1], [0, 0]], [[0, 1], [1, 3]], [[0, 1], [4, 4]], [[2, 3], [0, 0]], [[2, 3], [1, 3]], [[2, 3], [4, 4]]]); // prettier-ignore
assert.deepEqual(cutBlock([[2, 5], [1, 3]], [[0, 3], [0, 4]]), [[[2, 3], [1, 3]], [[4, 5], [1, 3]]]); // prettier-ignore
assert.deepEqual(cutBlock([[1, 1], [1, 1]], [[0, 2], [0, 2]]), [[[1, 1], [1, 1]]]); // prettier-ignore
assert.deepEqual(cutBlock([[1, 1], [1, 1]], [[1, 1], [1, 1]]), [[[1, 1], [1, 1]]]); // prettier-ignore

const size = (block) => prod(block.map((d) => d[1] - d[0] + 1));
assert.deepEqual(size([[1, 2], [3, 5], [6, 9]]), 24); // prettier-ignore

const toKey = (b) => b.flat().join(",");
assert.deepEqual(toKey([[1, 2], [3, 5], [6, 9]]), "1,2,3,5,6,9"); // prettier-ignore

const newBlock = (index, dims, value) => ({ index, dims, value });

function calc(input, max50 = true) {
  const blocks = {};
  const inputBlocks = [];
  for (let i = 0; i < input.length; i++) {
    const b = input[i];
    if (max50 && (b[1] < -50 || b[2] > 50 || b[3] < -50 || b[4] > 50 || b[5] < -50 || b[6] > 50)) continue;
    inputBlocks.push({ index: i, dims: [b.slice(1, 3), b.slice(3, 5), b.slice(5, 7)], value: b[0] });
  }
  for (const nb of inputBlocks) {
    const newBlocksQueue = [nb];
    while (newBlocksQueue.length > 0) {
      let b = newBlocksQueue.shift();
      const mapNewBlocks = (dims) => newBlock(b.index, dims, b.value);
      for (const [, v] of Object.entries(blocks)) {
        if (!overlaps(b.dims, v.dims)) continue;
        let bs = cutBlock(v.dims, b.dims);
        if (bs.length > 1) {
          delete blocks[toKey(v.dims)];
          bs.forEach((d) => {
            const k = toKey(d);
            if (v.value === "on") {
              blocks[k] = { index: v.index, dims: d, value: v.value };
            } else {
              delete blocks[k];
            }
          });
        }
        bs = cutBlock(b.dims, v.dims);
        if (bs.length > 1) {
          newBlocksQueue.push(...bs.map(mapNewBlocks));
          b = null;
          break;
        }
      }
      if (b !== null) {
        const k = toKey(b.dims);
        if (b.value === "on") {
          blocks[k] = b;
        } else {
          delete blocks[k];
        }
      }
    }
  }
  const ons = Object.values(blocks).filter((d) => d.value === "on");
  return sum(ons.map((d) => size(d.dims)));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(/[ ,]*[xyz]=|\.{2}/g).map((d, i) => (i > 0 ? Number(d) : d)));
  return [calc(input, true), calc(input, false)];
}
