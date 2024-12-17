import { groupBy, sum, toDict, unitCircle } from "../../../common";

const { min } = Math;

const DIRS = unitCircle(4); // right, down, left, up
const MOVE_DIR = { ">": 0, "v": 1, "<": 2, "^": 3 }; // prettier-ignore
const moveToDir = (m) => DIRS[MOVE_DIR[m]];
const toKey = (p) => `${p.x},${p.y}`;

const addPos = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y });

// eslint-disable-next-line no-unused-vars
function plotMap(mat, boxes, pos, move = null, size = -1) {
  let mat2 = mat.map((r) => r.slice());
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    mat2[box.y][box.x] = box.c;
  }
  mat2[pos.y][pos.x] = move ? move : "@";
  if (size > 0) {
    size = min(size, mat2.length, mat2[0].length);
    const s2 = (size - 1) / 2;
    let x0 = pos.x - s2;
    let y0 = pos.y - s2;
    if (x0 < 0) {
      x0 = 0;
    }
    if (y0 < 0) {
      y0 = 0;
    }
    if (x0 + size >= mat2[0].length) {
      x0 = mat2[0].length - size;
    }
    if (y0 + size >= mat2.length) {
      y0 = mat2.length - size;
    }
    mat2 = mat2.slice(y0, y0 + size).map((r) => r.slice(x0, x0 + size));
  }
  return mat2.map((r) => r.join("")).join("\n");
}

function moveVert(movingBoxes, mat, nextPos, moveDir, boxPieceDict) {
  movingBoxes.push(boxPieceDict[toKey(nextPos)]);
  let p = nextPos;
  while (true) {
    p = addPos(p, moveDir);
    const b = boxPieceDict[toKey(p)];
    if (b) {
      movingBoxes.push(b);
      continue;
    }
    const c = mat[p.y][p.x];
    if (c === "#") return false;
    if (c === ".") return true;
  }
}

function moveHor(movingBoxes, mat, nextPos, moveDir, boxPieceDict) {
  let nextStepBoxes = {};
  const addBox = (p) => {
    let b = boxPieceDict[toKey(p)];
    if (b.c === "]") {
      b = boxPieceDict[toKey({ x: p.x - 1, y: p.y })];
    }
    nextStepBoxes[toKey(b)] = b;
  };
  const addToMoving = (b) => {
    movingBoxes.push(b);
    if (b.c === "[") {
      b = boxPieceDict[toKey({ x: b.x + 1, y: b.y })];
      movingBoxes.push(b);
    }
  };
  addBox(nextPos);
  let canMove = true;
  while (canMove && Object.keys(nextStepBoxes).length > 0) {
    const checkList = Object.values(nextStepBoxes);
    nextStepBoxes = [];
    for (let i = 0; i < checkList.length; i++) {
      const bq = checkList[i];
      addToMoving(bq);
      const bqs = [bq];
      if (bq.c === "[") {
        bqs.push(addPos(bq, { x: 1, y: 0 }));
      }
      const pqs = bqs.map((p) => addPos(p, moveDir));
      for (let j = 0; j < pqs.length; j++) {
        const pn = pqs[j];
        const b = boxPieceDict[toKey(pn)];
        if (b) {
          if (!(b.c === "]" && j === 1)) {
            addBox(b);
          }
          continue;
        }
        const c = mat[pn.y][pn.x];
        if (c === "#") {
          nextStepBoxes = [];
          canMove = false;
          break;
        }
      }
    }
  }
  return canMove;
}

function calcResult(boxPieces) {
  return sum(boxPieces.filter((b) => b.c !== "]").map((b) => b.x + b.y * 100));
}

function calc(mat, moves) {
  const charDict = groupBy(
    mat.map((r, i) => r.map((c, j) => ({ x: j, y: i, c }))).flat(),
    (d) => d.c,
    (d) => d
  );
  let pos = charDict["@"][0];
  mat[pos.y][pos.x] = ".";
  const boxPieces = "O[]"
    .split("")
    .map((d) => (charDict[d] ? charDict[d] : []))
    .flat();
  for (const b of boxPieces) {
    mat[b.y][b.x] = ".";
  }
  let boxPieceDict = toDict(boxPieces, toKey, (d) => d);
  for (let y = 0; y < moves.length; y++) {
    const move = moves[y];
    const moveDir = moveToDir(move);
    const newPos = addPos(pos, moveDir);
    const newChar = mat[newPos.y][newPos.x];
    if (newChar === "#") {
      continue;
    }
    if (boxPieceDict[toKey(newPos)]) {
      let canMove = false;
      const movingBoxes = []; // boxes that will move
      if (moves[y] === "<" || moves[y] === ">") {
        canMove = moveVert(movingBoxes, mat, newPos, moveDir, boxPieceDict);
      } else {
        canMove = moveHor(movingBoxes, mat, newPos, moveDir, boxPieceDict);
      }
      if (canMove) {
        for (const b of movingBoxes) {
          b.x += moveDir.x;
          b.y += moveDir.y;
        }
        boxPieceDict = toDict(boxPieces, toKey, (d) => d);
      } else {
        continue;
      }
    }
    pos = newPos;
    continue;
  }
  return calcResult(boxPieces);
}

export default function (inputRows) {
  const [inputMat, inputMoves] = inputRows
    .join("\n")
    .split(/\n\n/)
    .map((r) => r.split(/\n/));
  const mat1 = inputMat.map((r) => r.split(""));
  const mat2changeDict = { "@": "@.", "#": "##", ".": "..", O: "[]" };
  const mat2 = mat1
    .map((r) => r.map((c) => mat2changeDict[c]))
    .map((r) => r.join(""))
    .map((r) => r.split(""));
  const moves = inputMoves.join("").split("");
  return [calc(mat1, moves), calc(mat2, moves)];
}
