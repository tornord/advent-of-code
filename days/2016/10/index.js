import { groupBy, prod } from "../../../common";

function parseInput(rows) {
  const bots = {};
  const chips = {};
  for (const r of rows) {
    if (r[0] === "bot") {
      const b = { id: r[1], low: { type: r[5], id: r[6] }, high: { type: r[10], id: r[11] } };
      bots[b.id] = b;
    } else if (r[0] === "value") {
      const c = { id: r[1], botId: r[5], outputId: null };
      chips[c.id] = c;
    }
  }
  return { bots, chips };
}

function runBots(bots, chips, question = null) {
  let someBotsWork = true;
  while (someBotsWork) {
    someBotsWork = false;
    for (const b of Object.values(bots)) {
      const cs = Object.values(chips).filter((d) => d.botId === b.id);
      if (cs.length < 2) continue;
      someBotsWork = true;
      cs.sort((d1, d2) => Number(d1.id) - Number(d2.id));
      cs[0].botId = b.low.type === "output" ? null : b.low.id;
      cs[0].outputId = b.low.type === "output" ? b.low.id : null;
      cs[1].botId = b.high.type === "output" ? null : b.high.id;
      cs[1].outputId = b.high.type === "output" ? b.high.id : null;
      if (question && cs[0].id === question.low && cs[1].id === question.high) {
        question.ans = b.id;
      }
    }
  }
}

function calc1(input) {
  const { bots, chips } = parseInput(input);
  const qs = Object.values(bots).length === 3 ? [2, 5] : [17, 61];
  const question = { low: String(qs[0]), high: String(qs[1]), ans: null };
  runBots(bots, chips, question);
  return Number(question.ans);
}

function calc2(input) {
  const { bots, chips } = parseInput(input);
  runBots(bots, chips);
  const outputs = groupBy(
    Object.values(chips),
    (d) => d.outputId,
    (d) => d.id
  );
  return prod(["0", "1", "2"].map((d) => Number(outputs[d][0])));
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(" "));
  return [calc1(input), calc2(input)];
}
