import { sum } from "../../../common";

const newDir = (name, parent) => ({ name, dirs: {}, files: {}, parent });

const dirSize = (dir) => {
  return sum(Object.values(dir.files)) + sum(Object.values(dir.dirs).map((d) => dirSize(d)));
};

const listDir = (dirs, dir) => {
  dirs.push({ name: dir.name, size: dirSize(dir) });
  for (const d of Object.values(dir.dirs)) {
    listDir(dirs, d);
  }
};

const scanFs = (rows) => {
  const fs = newDir("/", null);
  let cwd = fs;
  let i = 0;
  while (i < rows.length) {
    const r = rows[i];
    if (r[0] === "$") {
      if (r[1] === "cd") {
        if (r[2] === "/") {
          cwd = fs;
        } else if (r[2] === "..") {
          if (cwd.parent) {
            cwd = cwd.parent;
          }
        } else {
          const dir = cwd.dirs[r[2]];
          if (dir) {
            cwd = dir;
          }
        }
      }
    } else {
      // ls
      if (r[0] === "dir") {
        if (!cwd.dirs[r[1]]) {
          cwd.dirs[r[1]] = newDir(r[1], cwd);
        }
      } else {
        cwd.files[r[1]] = Number(r[0]);
      }
    }
    i++;
  }
  const dirs = [];
  listDir(dirs, fs);
  return dirs;
};

function calc1(dirs) {
  return sum(dirs.filter((d) => d.size <= 100000).map((d) => d.size));
}

function calc2(dirs) {
  const f = 30000000 - (70000000 - dirs[0].size);
  const rs = dirs.slice().filter((d) => d.size >= f);
  rs.sort((d1, d2) => d2.size - d1.size);
  return rs.at(-1).size;
}

export default function (inputRows) {
  const dirs = scanFs(inputRows.map((r) => r.split(" ")));
  return [calc1(dirs), calc2(dirs)];
}
