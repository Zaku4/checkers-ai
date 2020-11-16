import { Board } from './board.js';
import { AI } from './ai.js';
import { piece } from './pece.js';

let canvasWidth = 800;
let canvasHeight = 880;
let boardWidth = 800;
let cellWidth = boardWidth / 8;
let playerTurn = 0;
let board, ai;
let drawnClick = false;
let hasShownWinAlert = false;

window.setup = function setup() {
  createCanvas(canvasWidth, canvasHeight);
  reset();

  // Create buttons.
  const rulesButton = createButton('Rules');
  rulesButton.position(20, boardWidth + 30);
  rulesButton.style('font-size', '20px');
  rulesButton.mousePressed(showRules);

  const resetButton = createButton('Reset');
  resetButton.position(100, boardWidth + 30);
  resetButton.style('font-size', '20px');
  resetButton.mousePressed(reset);

  const switchButton = createButton('Switch Sides');
  switchButton.position(180, boardWidth + 30);
  switchButton.style('font-size', '20px');
  switchButton.mousePressed(switchSides);
}

window.draw = function draw() {
  background(100, 100, 100);
  board.draw();

  // Show whose turn it is.
  const turnText = board.turn == playerTurn ? "Turn: YOU" : "Turn: CPU";
  fill(255);
  textSize(30);
  text(turnText, 600, boardWidth + 50);

  // Check to see if we already have a winner.
  const winner = board.getWinner();
  if (winner != -1) {
    let winnerText;
    if (winner == playerTurn) {
      fill(0, 255, 0);
      winnerText = "You Win!";

      if (!hasShownWinAlert) {
        alert(`Congratulations on winning! Show Kevin the following key:\n${piece}`);
        hasShownWinAlert = true;
      }
    } else {
      fill(255, 0, 0);
      winnerText = "You Lose.";
    }

    text(winnerText, 400, boardWidth + 50);
  }

  if (drawnClick && winner == -1 && board.turn != playerTurn) {
    const result = ai.findMove(board);
    board.makeAIMove(...result);
  }

  drawnClick = true;
}

window.onclick = function mouseClicked() {
  const winner = board.getWinner();
  // Only process click if the game is still going.
  if (winner == -1) {
    const col = floor(mouseX / cellWidth);
    const row = floor(mouseY / cellWidth);
    if (row < 8 && col < 8) {
      board.click(row, col);
      drawnClick = false;
    }
  }

  return false;
}

function showRules() {
  let content = "Rules of Checkers\n"
  content += "-----------------\n"
  content += "1. Black moves first.\n"
  content += "2. Regular pieces can only move forward diagonally.\n"
  content += "3. Pieces can be 'kinged' if they reach the other side.\n"
  content += "4. Kinged pieces may move backwards diagonally as well.\n"
  content += "5. An enemy piece can be captured if your piece can jump over it diagonally and land on an open square.\n"
  content += "6. If provided the opportunity for a capture, you MUST take it.\n"
  content += "7. After capturing a piece, if the capturing piece can capture another piece, it must do so.\n"
  content += "8. A player wins when the opponent can no longer make a move.\n"

  alert(content);
}

function reset() {
  board = new Board(cellWidth, playerTurn, true)
  ai = new AI(1);
  drawnClick = false;
  hasShownWinAlert = false;
}

function switchSides() {
  playerTurn = 1 - playerTurn;
  reset();
}