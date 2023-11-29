import { dirname, extname, join, relative, sep } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { testRunner } from "./kattis/testHelpers";

function dirName(meta) {
  return dirname(fileURLToPath(meta.url));
}

function scanFolder(dir) {
  const name = dir.split(sep).at(-1);
  const isDir = (d, f) => fs.lstatSync(join(d, f)).isDirectory();
  const inputFiles = fs.readdirSync(dir).filter((f) => /\.(in)/.test(extname(f)) && !isDir(dir, f));
  const outputFiles = fs.readdirSync(dir).filter((f) => /\.(ans)/.test(extname(f)) && !isDir(dir, f));
  return { name, inputFiles, outputFiles };
}

function run() {
  const testDir = process.env.TEST_DIR ?? process.cwd();
  if (!testDir) return;
  const { name, inputFiles, outputFiles } = scanFolder(testDir);
  const thisDir = dirName(import.meta);
  const relDir = relative(join(thisDir, "kattis"), testDir);
  const moduleName = `.${sep}${relDir}`;
  testRunner(testDir, name, inputFiles, outputFiles, moduleName);
}

run();
