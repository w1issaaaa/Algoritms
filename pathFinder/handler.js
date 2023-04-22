window.addEventListener("load", () => {
  init();
  window.startButton.addEventListener("click", startFinder);

  window.cellButtons.addEventListener("click", changeCellMode);
});

let width = 20;
let height = 20;
let speed = 80;

let finder;
let start, finish;
let mazeChecker = true;
let runningMaze = false;
let currentState = "start",
  handleStates;

function init() {
  maze = [];

  handleStates = { 0: "unchecked", 1: "border", 2: "start", 3: "finish" }; //сщстояние клетки

  changeSpeed(80);
  matrixBuilder();
  refreshTable();
}

async function checkPoints() {
  return true;
}

async function renderPathLength(length) {
  await sleep(3000);
}

function dropTable() {
  let table = document.getElementById("table");

  if (table != null) {
    table.parentNode.removeChild(table);
  }
}

function refreshTable() {
  dropTable();
  tableBuilder(maze);
}

function matrixBuilder() {
  for (let i = 0; i < height; i++) {
    maze[i] = new Array(width);
    for (let j = 0; j < width; j++) {
      maze[i][j] = 0;
    }
  }
}

function changeCellMode(event) {
  let action = event.target.dataset.mode;

  if (action == null) {
    return;
  }

  currentState = action;
}

function checkReplacePoints(x, y, point) {
  if (point != null && point.x === x && point.y === y) {
    return null;
  }
  return point;
}

function changeColor(x, y, value, state, target) {
  maze[x][y] = value;
  target.dataset.mode = state;
}

function changeCell(event) {
  let dataset = event.target.dataset;
  start = checkReplacePoints(+dataset.row, +dataset.column, start);
  finish = checkReplacePoints(+dataset.row, +dataset.column, finish);

  switch (currentState) {
    case "border":
      if (dataset.mode === "border") {
        changeColor(dataset.row, dataset.column, 0, "unchecked", event.target);
        return;
      }

      changeColor(dataset.row, dataset.column, 1, "border", event.target);
      break;

    case "start":
      let prevCellStart = document.querySelector("td[data-mode='start']");
      if (prevCellStart != null) {
        prevCellStart.dataset.mode = "unchecked";
      }

      changeColor(dataset.row, dataset.column, 0, "start", event.target);
      start = new Point(parseInt(dataset.row), parseInt(dataset.column));
      break;

    case "finish":
      let prevCellFinish = document.querySelector("td[data-mode='finish']");
      if (prevCellFinish != null) {
        prevCellFinish.dataset.mode = "unchecked";
      }

      changeColor(dataset.row, dataset.column, 0, "finish", event.target);
      finish = new Point(parseInt(dataset.row), parseInt(dataset.column));
      break;
  }
}

function changeSpeed(event) {
  if (finder != null) {
    finder.changeDelay(1000 / speed);
  }
}

function tableBuilder(matrix) {
  let fieldBlock = window.field;
  let fieldSize = matrix.length;

  let table = document.createElement("table");
  table.setAttribute("id", "table");

  let blockWidth = fieldBlock.clientWidth;
  table.width = blockWidth;

  for (let i = 0; i < height; i++) {
    let row = table.insertRow(-1);

    for (let j = 0; j < width; j++) {
      let cell = row.insertCell(-1);

      cell.dataset.mode = handleStates[matrix[i][j]];
      cell.dataset.row = i.toString();
      cell.dataset.column = j.toString();
      cell.height = (blockWidth / fieldSize).toString();
    }
  }

  table.addEventListener("click", changeCell);
  fieldBlock.appendChild(table);
}

function disableCurrentFinder() {
  if (finder != null) {
    finder.running = false;
  }
}

async function startFinder() {
  if (!(await checkPoints())) {
    return;
  }
  disableCurrentFinder();

  let heuristic = euclidHeuristic;

  finder = new PathFinder(maze, heuristic, 1000 / speed);
  try {
    await renderPathLength(await finder.findPath(start, finish));
  } catch (e) {}
}
