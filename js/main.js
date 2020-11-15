import { Board } from './board.js';

let canvasWidth = 800;
let canvasHeight = 800;
let cellWidth = canvasWidth / 8;
let board = new Board(cellWidth, 1);

window.setup = function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

window.draw = function draw() {
  background(100, 100, 100);
  board.draw();

  if (board.validMoves.length == 0) {
    textSize(100);
    stroke(0);
    if (board.turn == board.player) {
      fill(255, 0, 0);
      text("You lose!", 210, 380);
    } else {
      fill(0, 255, 0);
      text("You win!", 210, 380);
    }
  }
}

window.onclick = function mouseClicked() {
  const col = floor(mouseX / cellWidth);
  const row = floor(mouseY / cellWidth);
  board.click(row, col);
  return false;
}