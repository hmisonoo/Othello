"use strict";

//ユーザーチェックに使用
let counter = 0;

//盤面の状況を管理
let stones = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

//最新の情報に画面を更新
const reflashStage = () => {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const id = document.getElementById(`${x}-${y}`);
      id.setAttribute("data-state", stones[x][y]);
    }
  }
  const user = document.getElementById("user");
  user.textContent = counter % 2 ? "黒の番" : "白の番";
};

//パス
const userChange = () => {
  counter++;
  reflashStage();
};

//
const checkAround = (x, y, addRow, addCol, player) => {
  try {
    let opponent = 3 - player;
    let r = x + addRow;
    let c = y + addCol;
    let result = 0;

    while (r >= 0 && r < 8 && c >= 0 && c < 8 && stones[r][c] == opponent) {
      r += addRow;
      c += addCol;
      result = 1;
    }

    if (r < 0) console.log("r < 0");
    else if (c < 0) console.log("c < 0");
    else if (r >= 8) console.log("r >= 8");
    else if (c >= 8) console.log("c >= 8");
    if (r < 0 || c < 0 || r >= 8 || c >= 8) return;

    if (stones[r][c] == player && result == 1) {
      r = x + addRow;
      c = y + addCol;
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && stones[r][c] == opponent) {
        stones[r][c] = player;
        r += addRow;
        c += addCol;
      }
    } else {
      result = 0;
    }
    return result;
  } catch (e) {
    console.log(e);
  }
};

const putStone = (id) => {
  let el = document.getElementById(id);
  if (el.getAttribute("data-state") != 0) return;

  let player = (counter % 2) + 1;

  const xy = id.split("-");
  const x = Number(xy[0]);
  const y = Number(xy[1]);
  let result = false;

  //8方向チェック
  for (let addRow = -1; addRow <= 1; addRow++) {
    for (let addCol = -1; addCol <= 1; addCol++) {
      //置いた場所はチェックしない
      if (addRow == 0 && addCol == 0) continue;

      if (checkAround(x, y, addRow, addCol, player)) {
        result = true;
      }
    }
  }

  if (result) {
    stones[x][y] = player;
    counter += 1;
  } else {
    alert("置けません");
  }

  reflashStage();
};

const setup = () => {
  const stage = document.getElementById("stage");
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      //　升目
      const cell = document.createElement("div");
      cell.classList.add("cell");

      //石
      const stone = document.createElement("div");
      stone.id = `${x}-${y}`;
      stone.classList.add("stone");
      stone.setAttribute("data-state", stones[x][y]);
      stone.addEventListener("click", (e) => {
        putStone(e.target.id);
      });

      cell.appendChild(stone);
      stage.appendChild(cell);
    }
  }
};

window.onload = () => setup();
