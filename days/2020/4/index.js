import { splitArray } from "../../../common";

const checkNumberField = (r, f, minV, maxV) => {
  const v = Number(r[f].match(/^(\d+)/)[1]);
  return v >= minV && v <= maxV;
};

function calc(input, part) {
  let res = 0;
  for (let y = 0; y < input.length; y++) {
    const r = input[y];
    if (r.byr && r.iyr && r.eyr && r.hgt && r.hcl && r.ecl && r.pid) {
      if (part === 2) {
        if (!checkNumberField(r, "byr", 1920, 2002)) continue;
        if (!checkNumberField(r, "iyr", 2010, 2020)) continue;
        if (!checkNumberField(r, "eyr", 2020, 2030)) continue;
        if (r.hgt.endsWith("cm")) {
          if (!checkNumberField(r, "hgt", 150, 193)) continue;
        } else if (r.hgt.endsWith("in")) {
          if (!checkNumberField(r, "hgt", 59, 76)) continue;
        } else {
          continue;
        }
        if (!r.hcl.match(/^#[0-9a-f]{6}$/)) continue;
        if (!r.ecl.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/)) continue;
        if (!r.pid.match(/^\d{9}$/)) continue;
      }
      res++;
    }
  }
  return res;
}

export default function (inputRows) {
  let input = splitArray(inputRows, (r) => r === "").map((r) => r.map((d) => d.split(" ")).flat());
  input = input.map((r) => Object.fromEntries(r.map((d) => d.split(":"))));
  return [calc(input, 1), calc(input, 2)];
}
