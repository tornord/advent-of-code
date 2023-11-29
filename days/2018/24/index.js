import { matchNumbers, sum, toDict } from "../../../common";

const { floor, min } = Math;

const effectivePower = (u) => {
  return u.nUnits * (u.boost + u.nAttack);
};

function damage(attacker, defender) {
  const { immunes, weaks } = defender;
  const { attackType } = attacker;
  return effectivePower(attacker) * (immunes.includes(attackType) ? 0 : weaks.includes(attackType) ? 2 : 1);
}

function targetSelection(attackers, defenders) {
  const targets = [];
  const aa = attackers
    .filter((d) => d.nUnits > 0)
    .sort((a1, a2) => {
      const c = effectivePower(a2) - effectivePower(a1);
      if (c !== 0) return c;
      return a2.initiative - a1.initiative;
    });
  for (const a of aa) {
    const dd = defenders
      .filter((d) => d.nUnits > 0 && damage(a, d) > 0)
      .sort((d1, d2) => {
        let c = damage(a, d2) - damage(a, d1);
        if (c !== 0) return c;
        c = effectivePower(d2) - effectivePower(d1);
        if (c !== 0) return c;
        return d2.initiative - d1.initiative;
      });
    for (const d of dd) {
      if (targets.map(([, e]) => e).includes(d)) continue;
      targets.push([a, d]);
      break;
    }
  }
  return targets;
}

function resolveFight(imsys, inf, boost) {
  imsys.forEach((d) => (d.boost = boost));
  let i = 0;
  while (i < 3000 && sum(imsys.map((d) => d.nUnits)) > 0 && sum(inf.map((d) => d.nUnits)) > 0) {
    const log = [];
    const t1 = targetSelection(imsys, inf);
    const t2 = targetSelection(inf, imsys);
    const targets = [...t1, ...t2].sort((d1, d2) => d2[0].initiative - d1[0].initiative);
    for (const u of imsys) {
      if (u.nUnits <= 0) continue;
      log.push([u.id, u.nUnits]);
    }
    for (const u of inf) {
      if (u.nUnits <= 0) continue;
      log.push([u.id, u.nUnits]);
    }
    log.push([]);
    for (const t of targets) {
      const dam = damage(...t);
      const u = min(t[1].nUnits, floor(dam / t[1].nHitPoints));
      t[1].nUnits -= u;
      log.push([`${t[0].id} attacks ${t[1].id}, damages ${dam}, killing ${u} units`]);
    }
    log.push([]);
    i++;
    // if (i % 1000 === 0) {
    //   log.forEach((d) => console.log(...d));
    //   i;
    // }
  }
  return [i, sum(imsys.map((d) => d.nUnits)), sum(inf.map((d) => d.nUnits))];
}

function parseWeakImmunes(r) {
  const rs = r
    .split("; ")
    .map((d) => d.split(" to "))
    .map(([t, ws]) => ({ t: `${t}s`, ws: ws.split(", ") }));
  return toDict(rs, (d) => d.t, (d) => d.ws); // prettier-ignore
}

function parseSystem(rows) {
  const rs = rows.map((r) => r.match(/(.+) hit points (\(.+\) )?with an (.+)/).slice(1));
  return rs.map((r) => {
    const [nUnits, nHitPoints] = matchNumbers(r[0]);
    const { weaks, immunes } = { weaks: [], immunes: [], ...(r[1] ? parseWeakImmunes(r[1].replace(/\(|\) /g, "")) : {}) }; // prettier-ignore
    const [, nAttack, attackType, initiative] = r[2].match(/attack that does (\d+) (.+) damage at initiative (\d+)/);
    return { nUnits, nHitPoints, weaks, immunes, nAttack: Number(nAttack), attackType, initiative: Number(initiative), boost: 0 }; // prettier-ignore
  });
}

function calc1(imsys, inf) {
  const res = resolveFight(
    imsys.map((d) => ({ ...d })),
    inf.map((d) => ({ ...d })),
    0
  );
  return res[2];
}

function calc2(imsys, inf, boost) {
  if (boost) {
    const res = resolveFight(
      imsys.map((d) => ({ ...d })),
      inf.map((d) => ({ ...d })),
      boost
    );
    return res[1];
  }
  for (let b = 1; b <= 200; b++) {
    const res = resolveFight(
      imsys.map((d) => ({ ...d })),
      inf.map((d) => ({ ...d })),
      b
    );
    if (res[2] === 0) {
      return res[1];
    }
  }
}

export default function (inputRows, f) {
  let boost = null;
  if (f === "example.txt") {
    boost = 1570;
  }
  const n0 = 0;
  const n1 = inputRows.findIndex((d) => d === "Infection:");
  const imsys = parseSystem(inputRows.slice(n0 + 1, n1 - 1));
  const inf = parseSystem(inputRows.slice(n1 + 1));
  imsys.forEach((d, i) => (d.id = `Imm ${i + 1}`));
  inf.forEach((d, i) => (d.id = `Inf ${i + 1}`));
  return [calc1(imsys, inf, 0), calc2(imsys, inf, boost)];
}
