import { Board } from './board.js';

let canvasWidth = 800;
let canvasHeight = 800;
let cellWidth = canvasWidth / 8;
let board = new Board(cellWidth, 0);

window.setup = function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

window.draw = function draw() {
  background(100, 100, 100);
  board.draw();
}

window.onclick = function mouseClicked() {
  const col = floor(mouseX / cellWidth);
  const row = floor(mouseY / cellWidth);
  board.click(row, col);
  return false;
}