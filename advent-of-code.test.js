import { dirname, extname, join, relative, resolve, sep } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

function dirName(meta) {
  return dirname(fileURLToPath(meta.url));
}

function scanFolder(dir) {
  const name = dir.split(sep).at(-1);
  const isDir = (d, f) => fs.lstatSync(join(d, f)).isDirectory();
  const files = fs.readdirSync(dir).filter((f) => /\.(txt)/.test(extname(f)) && !isDir(dir, f));
  return { name, files };
}

function readInput(filename) {
  let input = fs.readFileSync(filename, "utf-8").split("\n");
  let expected = null;
  if (input[0].startsWith("//")) {
    const s = input[0].slice(2).trim();
    if (s) {
      expected = JSON.parse(s);
      input = input.slice(1);
    }
  }
  const nRows = input.findLastIndex((r) => r !== "") + 1;
  if (nRows !== input.length) {
    input = input.slice(0, nRows);
  }
  return { input, expected };
}

export function testRunner(dir, name, files, moduleName) {
  // const dir = dirName(meta);
  // const { name, files } = scanFolder(dir);
  let mod = null;
  describe(name, () => {
    files.forEach((f) => {
      if (!f.startsWith("skip.")) {
        test(f, async () => {
          const { input, expected } = readInput(join(dir, f));
          // if (!expected || !isArray(expected) || expected.length === 0) return;
          if (mod === null) {
            mod = await import(moduleName);
          }
          const output = mod.default(input, f);
          if (expected) {
            expect(output).toEqual(expected);
          } else {
            console.log(name, f, output); // eslint-disable-line
          }
        });
      } else {
        test.skip(f, () => {});
      }
    });
  });
}

function runDir(testDir) {
  const { files } = scanFolder(testDir);
  const thisDir = dirName(import.meta);
  const name = testDir.split(sep).slice(-2).join("-");
  const relDir = relative(thisDir, testDir);
  const moduleName = `.${sep}${relDir}`;
  testRunner(testDir, name, files, moduleName);
}

function runYear(testDir) {
  const ms = fs.readdirSync(testDir);
  ms.sort((a, b) => Number(a) - Number(b));
  for (const f of ms) {
    const dir = `${testDir}/${f}`;
    if (!/^[0-9]{1,2}$/.test(f)) continue;
    if (!fs.lstatSync(dir).isDirectory()) continue;
    runDir(dir);
  }
}

function runAll(testDir) {
  const ms = fs.readdirSync(testDir);
  for (const f of ms) {
    const dir = `${testDir}/${f}`;
    if (!/^[0-9]{4}$/.test(f)) continue;
    if (!fs.lstatSync(dir).isDirectory()) continue;
    runYear(dir);
  }
}

function run() {
  let testDir = process.env.TEST_DIR ?? process.cwd();
  if (!testDir) {
    testDir = resolve(".", "days");
  }
  if (!testDir || /days\/?$/.test(testDir)) {
    runAll(testDir);
  } else if (/days\/[0-9]{4}\/?$/.test(testDir)) {
    runYear(testDir);
  } else if (/days\/[0-9]{4}\/[0-9]{1,2}\/?$/.test(testDir)) {
    runDir(testDir);
  }
}

run();
