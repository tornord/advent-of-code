import { newArray, toDict } from "../../../common";

function runStep(machine) {
  const { tape, cursor, state, stateDict } = machine;
  const v = tape[cursor] ?? 0;
  const b = stateDict[state];
  const r = b.actions[v];
  if (Number(r[0]) === 0) {
    delete tape[cursor];
  } else {
    tape[cursor] = 1;
  }
  machine.cursor += r[1] === "right" ? 1 : -1;
  machine.state = r[2];
}

function calc(beginWith, stateDict, nSteps) {
  const tape = {};
  const state = "A";
  const cursor = 0;
  const machine = { tape, cursor, state, stateDict };
  for (let i = 0; i < nSteps; i++) {
    runStep(machine);
  }
  return Object.values(tape).length;
}

export default function (inputRows) {
  const input = inputRows.map((r) =>
    r
      .replace(/([.:]| steps\.)$/g, "")
      .split(" ")
      .at(-1)
  );
  const beginWith = input[0];
  const nSteps = Number(input[1]);
  const states = newArray((input.length - 2) / 10, (i) => ({
    id: input[10 * i + 3],
    actions: [5, 9].map((d) => input.slice(10 * i + d, 10 * i + d + 3)),
  }));
  const stateDict = toDict(
    states,
    (d) => d.id,
    (d) => d
  );
  return calc(beginWith, stateDict, nSteps);
}
