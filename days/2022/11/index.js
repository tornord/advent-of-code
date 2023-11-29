import { groupBy, prod } from "../../../common";

const { floor } = Math;

function parseMonkey(rows) {
  const id = Number(rows[0]);
  const items = rows[1]
    .split(", ")
    .map(Number)
    .map((d) => ({ level: d, monkeyId: id }));
  const operation = rows[2].split(/ /);
  const divisibleBy = Number(rows[3]);
  const trueTest = Number(rows[4]);
  const falseTest = Number(rows[5]);
  return { id, items, operation, divisibleBy, trueTest, falseTest, inspectCount: 0 };
}

function calc(ms, roundCount, divisor) {
  const monkeys = [];
  const items = [];
  for (const d of ms) {
    const m = parseMonkey(d);
    items.push(...m.items);
    monkeys.push(m);
  }

  const mod = prod(monkeys.map((d) => d.divisibleBy));
  for (let rnd = 0; rnd < roundCount; rnd++) {
    for (const m of monkeys) {
      const itms = items.filter((d) => d.monkeyId === m.id);
      for (const item of itms) {
        m.inspectCount++;
        const op = m.operation[2] === "old" ? item.level : Number(m.operation[2]);
        if (m.operation[1] === "+") {
          item.level += op;
        } else {
          item.level *= op;
        }
        if (divisor !== 1) {
          item.level = floor(item.level / divisor);
        }
        item.level %= mod;
        const tst = item.level % m.divisibleBy === 0;
        item.monkeyId = tst ? m.trueTest : m.falseTest;
      }
    }
  }
  monkeys.sort((m1, m2) => m1.inspectCount - m2.inspectCount);
  return monkeys.at(-1).inspectCount * monkeys.at(-2).inspectCount;
}

export default function (inputRows) {
  const rs = inputRows.map((r) =>
    r.replace(/\s*(Monkey|Start.+items|Oper.+new =|Test.+by|If.+monkey):*\s*/, "").replace(/:$/g, "")
  );
  const gs = Object.values(groupBy(rs, (_, i) => floor(i / 7)));
  return [calc(gs, 20, 3), calc(gs, 10000, 1)];
}
