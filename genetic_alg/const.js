window.addPointButton.addEventListener("click", function () {
    currentState = "add";
    window.current_action_view.textContent = `${window.addPointButton.textContent}`;
});

const WIDTH = document.getElementById("canv").offsetWidth;
const HEIGHT = document.getElementById("canv").offsetHeight;

const BACKGROUND_COLOR = "aliceblue";
const CIRCLE_COLOR = "lightpink";
const LINE_COLOR = "violet";
const DEFAULT_LOG_COLOR = "coral";

const canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');

let renderCoefficientPopulation = 1;
let bestView = true;
let autoSize = true;
let running = false;