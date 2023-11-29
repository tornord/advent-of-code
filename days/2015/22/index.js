import { newArray, sum } from "../../../common";

const { max } = Math;

function handleEffects(state) {
  const dam = sum(state.spells.map((d) => (d !== null && d.turns ? d.damage : 0)));
  state.bossHp -= dam;
  const man = sum(state.spells.map((d) => (d !== null && d.turns ? d.newManas : 0)));
  state.playerMana += man;
}

const SPELLS = [
  { name: "Magic Missile", mana: 53, heals: 0, damage: 4, armor: 0, newManas: 0, turns: null },
  { name: "Drain", mana: 73, heals: 2, damage: 2, armor: 0, newManas: 0, turns: null },
  { name: "Shield", mana: 113, heals: 0, damage: 0, armor: 7, newManas: 0, turns: 6 },
  { name: "Poison", mana: 173, heals: 0, damage: 3, armor: 0, newManas: 0, turns: 6 },
  { name: "Recharge", mana: 229, heals: 0, damage: 0, armor: 0, newManas: 101, turns: 5 },
];
SPELLS.forEach((d, i) => (d.index = max(i - 1, 0)));

function nextStates(state, spellPlayed = null) {
  const res = [];
  let ss = SPELLS.map((d) => ({ ...d })).filter((d) => d.mana <= state.playerMana);
  if (spellPlayed) {
    ss = ss.filter((d) => d.name === spellPlayed);
  }
  for (const ns of ss) {
    if (ns.turns !== null && state.spells[ns.index] && state.spells[ns.index].turns > 1) {
      continue;
    }
    const newState = { ...state, spells: state.spells.map((d) => (d === null ? null : { ...d })) };
    newState.path = `${state.path}${state.path.length > 0 ? " - " : ""}${ns.name}`;
    // Players turn
    if (newState.level === "hard") {
      newState.playerHp--;
    }
    newState.playerMana -= ns.mana;
    newState.totalMana += ns.mana;
    if (newState.playerHp <= 0) {
      newState.result = -1;
    } else {
      if (ns.turns === null) {
        newState.playerHp += ns.heals;
        newState.bossHp -= ns.damage;
      }
      handleEffects(newState);
      newState.spells.forEach((d) => {
        if (d !== null && d.turns !== null) {
          d.turns = max(d.turns - 1, 0);
        }
      });
    }
    newState.spells[ns.index] = ns;
    newState.turn++;
    if (newState.result === null) {
      if (newState.bossHp <= 0) {
        newState.result = 1;
      } else {
        // Boss turn
        handleEffects(newState);
        if (newState.bossHp <= 0) {
          newState.result = 1;
        } else {
          const arm = sum(newState.spells.map((d) => (d !== null && d.turns ? d.armor : 0)));
          const dam = max(newState.bossDamage - arm, 1);
          newState.playerHp -= dam;
          if (newState.playerHp <= 0) {
            newState.result = -1;
          }
        }
      }
    }
    newState.spells.forEach((d) => {
      if (d !== null && d.turns !== null) {
        d.turns = max(d.turns - 1, 0);
      }
    });
    newState.turn++;
    res.push(newState);
  }
  return res;
}

function startState(p1, p2, level) {
  return {
    playerHp: p1.hp,
    playerMana: p1.mana,
    bossHp: p2.hp,
    bossDamage: p2.damage,
    spells: newArray(4, () => null),
    result: null,
    totalMana: 0,
    turn: 0,
    path: "",
    level,
  };
}

function calc(p1, p2, level = "easy") {
  const wins = [];
  const losses = [];
  const queue = [startState(p1, p2, level)];
  let minWinMana = null;
  // let minStategy = null;
  while (queue.length > 0) {
    const q = queue.pop();
    if (minWinMana !== null && q.totalMana > minWinMana) {
      continue;
    }
    const ns = nextStates(q);
    if (ns.length === 0) {
      losses.push(q.totalMana);
      continue;
    }
    for (const n of ns) {
      if (n.result !== null) {
        if (n.result === 1) {
          if (minWinMana === null || n.totalMana < minWinMana) {
            minWinMana = n.totalMana;
            // minStategy = n.path;
          }
          wins.push(n.totalMana);
        } else {
          losses.push(n.totalMana);
        }
        continue;
      }
      queue.push(n);
    }
  }
  return minWinMana;
}

// ["Poison", "Magic Missile"]
// ["Recharge", "Shield", "Drain", "Poison", "Magic Missile"]
// ["Recharge", "Recharge", "Poison", "Shield", "Poison", "Poison", "Shield", "Poison", "Magic Missile", "Magic Missile"]

// function calc3() {
//   // replay({ hp: 10, mana: 250 }, { hp: 13, damage: 8 }, ["Poison", "Magic Missile"]);
//   replay({ hp: 10, mana: 250 }, { hp: 14, damage: 8 }, ["Recharge", "Shield", "Drain", "Poison", "Magic Missile"]);
//   return 0;
// }

// function replay(p1, p2, spells) {
//   let st = startState(p1, p2);
//   for (const s of spells) {
//     [st] = nextStates(st, s);
//   }
// }

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(":").slice(1)).map(Number);
  const p1 = input[0] === 14 ? { hp: 10, mana: 250 } : { hp: 50, mana: 500 };
  const p2 = { hp: input[0], damage: input[1] };
  return [calc(p1, p2, "easy"), calc(p1, p2, p1.hp === 50 ? "hard" : "easy")];
}
