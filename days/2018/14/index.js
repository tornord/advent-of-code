import { strict as assert } from "node:assert";
import { LinkedList } from "../../../common";

const { floor } = Math;

// eslint-disable-next-line
function printList(list) {
  let node = list.head;
  let s = "";
  do {
    s += node.item;
    node = node.next;
  } while (node !== list.head);
  console.log(s); // eslint-disable-line
}

const stepElf = (elf) => {
  const n1 = elf.item + 1;
  for (let j = 0; j < n1; j++) {
    elf = elf.next;
  }
  return elf;
};

function runRecipes(nRec, nTail = 10, scoreSequence = null) {
  const list = new LinkedList();
  list.insert(3);
  list.insert(7);
  let elf1 = list.head;
  let elf2 = elf1.next;
  let n = 2;
  let tail = "";
  for (let i = 0; i < 100_000_000; i++) {
    const v = elf1.item + elf2.item;
    if (v >= 10) {
      list.insert(floor(v / 10), list.head.prev);
      tail = `${tail}${list.head.prev.item}`.slice(-nTail);
      n++;
      if (n >= nRec + nTail) break;
      if (scoreSequence === tail) return n - nTail;
    }
    list.insert(v % 10, list.head.prev);
    tail = `${tail}${list.head.prev.item}`.slice(-nTail);
    n++;
    if (n >= nRec + nTail) break;
    if (scoreSequence === tail) return n - nTail;
    elf1 = stepElf(elf1);
    elf2 = stepElf(elf2);
  }
  return tail;
}
assert.equal(runRecipes(5), "0124515891");
assert.equal(runRecipes(9), "5158916779");
assert.equal(runRecipes(18), "9251071085");
assert.equal(runRecipes(2018), "5941429882");
assert.equal(runRecipes(1_000_000, 5, "51589"), 9);
assert.equal(runRecipes(1_000_000, 5, "59414"), 2018);

function calc1(nRec) {
  return runRecipes(nRec);
}

function calc2(input) {
  return runRecipes(100_000_000, input.length, input);
}

export default function (inputRows) {
  const input = inputRows[0];
  return [calc1(Number(input)), calc2(input)];
}
