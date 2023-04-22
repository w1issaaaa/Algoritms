function drawCircle(x, y, radius, color, angle) {
    if (angle === undefined) {
        angle = 2 * Math.PI;
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, angle, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function drawSlidingCircles(circles) {
    for (let i = 0; i < circles.length; i++) {
        drawCircle(circles[i].center.x, circles[i].center.y, 3, "hsla(12,90%,51%,0.47)");
        ctx.font = 'bold 20px serif';
        ctx.globalAlpha = 0.2;
        drawCircle(circles[i].center.x, circles[i].center.y, circles[i].radius, "hsla(8,72%,61%,0.47)");
        ctx.globalAlpha = 1;
    }
}

function createPoint(e) {
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    points.push(new Point(x, y));
    drawCircle(x, y, 10, "pink");
}

function clear() {
    if (!running) {
        points = [];
        means = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function redrawInitial() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < points.length; i++) {
        drawCircle(points[i].x, points[i].y, 10, "pink");
    }
}

async function colorClasses(colorMap, alpha, angle) {
    ctx.globalAlpha = alpha;
    for (let i = 0; i < means.length; i++) {
        drawCircle(means[i].x, means[i].y, 22, colorMap[i]);
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < points.length; i++) {
        drawCircle(points[i].x, points[i].y, 10, colorMap[points[i].class], angle);
    }
}

async function startKMC() {
    if (running === true) {
        return;
    }
    running = true;
    let classNum = 5;
    if (points.length < classNum) {
        running = false;
        await showError;
        return;
    }
    redrawInitial();
    let result = kMeans(classNum, points, 1000);
    means = result.means;
    points = result.points;
    let colorMap = [];
    for (let i = 0; i < classNum; i++) {
        colorMap.push(`hsl(${i * 360 / classNum},100%,60%)`);
    }
    await colorClasses(colorMap, 0.6, 2 * Math.PI);
    running = false;
}

async function startBoth() {
    redrawInitial();
    let radius = 90;
    let result = await meanShiftClustering(points, radius);
    means = result.means;
    points = result.points;
    let colorMapMSC = [ ];
    for (let i = 0; i < means.length; i++) {
        colorMapMSC.push(`hsl(${i * 360 / means.length},80%,40%)`);
    }
    redrawInitial();
    await colorClasses(colorMapMSC, 0.67, 2 * Math.PI);
    result = kMeans(classNum, points, 999);
    means = result.means;
    points = result.points;
    let colorMapKMC = [ ];
    for (let i = 0; i < classNum; i++) {
        colorMapKMC.push(`hsl(${i * 360 / classNum},100%,60%)`);
    }
    await colorClasses(colorMapKMC, 0.15, Math.PI);
    running = false;
}
const clearButton = document.getElementById("clearButton");
//const startKMeansButton = document.getElementById("startKMeans");
//const startMeanShiftButton = document.getElementById("startMeanShift");
const startBothButton = document.getElementById("startBoth");
// const scrollClasses = document.getElementById("classAmount");
const scrollClasses = 5;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let points = [];
let means = [];
let running = false;
clearButton.addEventListener("click", clear);
//startKMeansButton.addEventListener("click", startKMC);
//startMeanShiftButton.addEventListener("click", startMSC);
startBothButton.addEventListener("click", startBoth);
canvas.addEventListener("mousedown", createPoint);
