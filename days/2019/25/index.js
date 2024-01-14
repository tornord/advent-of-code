import { matchNumbers, newArray } from "../../../common";
import { Intcode } from "../intcode";

function toAscii(str) {
  return newArray(str.length, (d) => str.charCodeAt(d));
}

function sendMessage(prg, msg) {
  const input = toAscii(`${msg}\n`);
  return receiveMessage(prg, input);
}

function receiveMessage(prg, input) {
  const output = [];
  while (!prg.halted) {
    const out = prg.run(input);
    input = null;
    if (out.length === 0) break;
    output.push(...out);
  }
  const msg = output.map((d) => String.fromCharCode(d)).join("");
  return msg;
}

function calc1(prog) {
  const prg = new Intcode(prog);
  prg.pausOnInput = true;
  let msg = receiveMessage(prg); //toAscii("inv\n");
  msg = sendMessage(prg, "north");
  msg = sendMessage(prg, "take mutex"); // Kitchen
  // msg = sendMessage(prg, "west");
  // msg = sendMessage(prg, "take escape pod");
  msg = sendMessage(prg, "east");
  msg = sendMessage(prg, "east");
  msg = sendMessage(prg, "east");
  // msg = sendMessage(prg, "take whirled peas"); // Crew Quarters
  msg = sendMessage(prg, "west");
  msg = sendMessage(prg, "west");
  msg = sendMessage(prg, "west");
  msg = sendMessage(prg, "south");
  msg = sendMessage(prg, "west");
  msg = sendMessage(prg, "take space law space brochure"); // Stables
  msg = sendMessage(prg, "north");
  // msg = sendMessage(prg, "take loom"); // Arcade
  msg = sendMessage(prg, "south");
  msg = sendMessage(prg, "south");
  msg = sendMessage(prg, "take hologram"); // Corridor
  msg = sendMessage(prg, "west");
  msg = sendMessage(prg, "take manifold"); // Holodeck
  // msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "take photons"); // Hot Chocolate Fountain
  msg = sendMessage(prg, "east");
  // msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "take molten lava"); // Storage
  msg = sendMessage(prg, "north");
  msg = sendMessage(prg, "east");
  msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "take cake"); // Navigation
  msg = sendMessage(prg, "west");
  // msg = sendMessage(prg, "north");
  // msg = sendMessage(prg, "take giant electromagnet"); // Warp Drive Maintenance
  // msg = sendMessage(prg, "south");
  msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "take easter egg"); // Science Lab
  msg = sendMessage(prg, "south");
  msg = sendMessage(prg, "inv");
  msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "north");
  // msg = sendMessage(prg, "east");
  // msg = sendMessage(prg, "south");
  // msg = sendMessage(prg, "take infinite loop"); // Observatory
  const res = matchNumbers(msg);
  // console.log(msg);
  return res[0];
}

export default function (inputRows) {
  const input = inputRows.map((r) => r.split(",").map(Number))[0];
  return calc1(input);
}
