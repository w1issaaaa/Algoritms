window.addEventListener("load", () => {
  init();
  window.startButton.addEventListener("click", startAlg);
});

let cities = [];
let tempAdd = [];
let tempRemove = [];

canvas.addEventListener("click", changePoint);

function init() {
  ctx.beginPath();
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.rect(0, 0, WIDTH, HEIGHT);
  ctx.fill();
}

function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function changePoint(e) {
  createPoint(e);
  window.cities_number.textContent = `${cities.length}`;
}

function checkPoint(checkingPoint, set) {
  for (let i = 0; i < set.length; i++) {
    if (
      checkingPoint.x <= set[i].x + 20 &&
      checkingPoint.x >= set[i].x - 20 &&
      checkingPoint.y <= set[i].y + 20 &&
      checkingPoint.y >= set[i].y - 20
    ) {
      return true;
    }
  }
  return false;
}

function getIndexOfPoint(checkingPoint, set) {
  let index = -1;
  for (let i = 0; i < set.length; i++) {
    if (
      checkingPoint.x <= set[i].x + 10 &&
      checkingPoint.x >= set[i].x - 10 &&
      checkingPoint.y <= set[i].y + 10 &&
      checkingPoint.y >= set[i].y - 10
    ) {
      index = i;
    }
  }
  return index;
}

function createPoint(e) {
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  let point = { x: x, y: y };

  if (checkPoint(point, cities)) {
    return;
  }

  drawCircle(x, y, 10, CIRCLE_COLOR);

  if (running) {
    tempAdd.push(point);
    running = false;
  } else {
    cities.push(point);
  }
}

function drawPoints() {
  cities.forEach((city) => {
    drawCircle(city.x, city.y, 10, CIRCLE_COLOR);
  });
}

function renewCanvas() {
  ctx.beginPath();
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.rect(0, 0, WIDTH, HEIGHT);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, width, color) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawLines(order, width, color) {
  for (let i = 0; i < cities.length - 1; i++) {
    drawLine(
      cities[order[i]].x,
      cities[order[i]].y,
      cities[order[i + 1]].x,
      cities[order[i + 1]].y,
      width,
      color
    );
  }
  drawLine(
    cities[order[order.length - 1]].x,
    cities[order[order.length - 1]].y,
    cities[order[0]].x,
    cities[order[0]].y,
    width,
    color
  );
}

async function startAlg() {
  if (cities.length <= 1) {
    await sleep(1000);
  } else if (!running) {
    running = true;
    await geneticAlg();
  }
}
