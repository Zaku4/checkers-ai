import { Piece } from './piece.js';
import { Cell } from './cell.js';

class Board {
  constructor(cellWidth) {
    this.cellWidth = cellWidth;
    this.board = [];
    this.turn = 0; // 0 for first player, 1 for second player.
    this.selectedPiece = undefined;
    this.validMoves = undefined;

    // Create the board.
    for (let row = 0; row < 8; row++) {
      const columns = []
      for (let col = 0; col < 8; col++) {
        columns.push(new Cell([col, row], this.cellWidth));
      }
      this.board.push(columns);
    }

    this.blackPieces = [];
    // Place starting black pieces.
    for (let row = 5; row < 8; row++) {
      for (let col = row % 2; col < 8; col += 2) {
        const piece = new Piece(0, [col, row], this.cellWidth);
        this.board[row][col].piece = piece;
        this.blackPieces.push(piece);
      }
    }

    this.redPieces = [];
    // Place starting red pieces.
    for (let row = 0; row < 3; row++) {
      for (let col = row % 2; col < 8; col += 2) {
        const piece = new Piece(1, [col, row], this.cellWidth);
        this.board[row][col].piece = piece;
        this.redPieces.push(piece);
      }
    }

    this.updateValidMoves();
  }

  updateValidMoves() {
    this.validMoves = this.getAllValidMoves();
  }

  draw() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // Draw the cell.
        this.board[row][col].draw();
      }
    }
  }

  /**
   * Returns a list of pieces and valid moves. Index i of valid moves provides
   * the list of valid moves for piece at index i of pieces.
   */
  getAllValidMoves() {
    const pieces = this.turn == 0 ? this.blackPieces : this.redPieces;
    let moves = pieces.map(piece => this.getValidMoves(piece));

    // Check to see if any of the moves did a capture.
    let hasCapture = false;
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
        const move = moves[i][j];
        // If the difference in rows is more than 1, then it was a capture.
        if (Math.abs(move[0] - pieces[i].location[1])) {
          hasCapture = true;
          break;
        }
      }

      if (hasCapture) {
        break;
      }
    }

    // If there was a capture, we must filter out all of the moves that are non-capturing.
    if (hasCapture) {
      for (let i = 0; i < moves.length; i++) {
        moves[i] = moves[i].filter(move => Math.abs(move[0] - pieces[i].location[1] > 1));
      }
    }

    return [pieces, moves];
  }

  getValidMoves(piece) {
    const [col, row] = piece.location;

    // Directions represents in which directions we should check for valid moves.
    const directions = [];
    // Black moves upwards.
    directions.push(piece.color == 0 ? -1 : 1);

    // If the piece is a king, it can also move in the reverse direction.
    if (piece.isKing) {
      directions.push(directions[0] * -1);
    }

    const moves = []; // Valid moves.
    let canCapture = false; // If there is an option to capture, only capturing moves are valid.

    directions.forEach(dir => {
      let newRow = row + dir;
      if (this.isValidIndex(newRow)) {
        // Check left and right diagonal.
        for (let offset = -1; offset <= 1; offset += 2) {
          let newCol = col + offset;
          if (this.isValidIndex(newCol)) {
            // If there isn't a piece in that direction, it is valid.
            // We also must check that we aren't only doing capturing moves.
            const otherPiece = this.board[newRow][newCol].piece;
            if (!canCapture && !otherPiece) {
              moves.push([newRow, newCol]);
            } else if (otherPiece && otherPiece.color != piece.color) {
              // If there is a piece, it must be of the opposite color
              // and there must be a space for a capture to be valid.
              const jumpRow = newRow + dir;
              const jumpCol = newCol + offset;  
              if (this.isValidIndex(jumpRow) && this.isValidIndex(jumpCol)) {
                if (!this.board[jumpRow][jumpCol].piece) {
                  moves.push([jumpRow, jumpCol]);
                  canCapture = true;
                }
              }
            }
          }
        }
      }
    });

    // If you can capture, filter out noncapturing moves.
    if (canCapture) {
      return moves.filter(move => Math.abs(move[0] - row) > 1);
    } else {
      return moves;
    }
  }

  displayMoves(moves, show) {
    moves.forEach(move => {
      const [row, col] = move;
      this.board[row][col].isHighlighted = show;
    });
  }

  click(row, col) {
    const piece = this.board[row][col].piece;
    if (piece) {
      if (this.selectedPiece) {
        this.displayMoves(this.getValidMoves(this.selectedPiece), false);
      }
      this.displayMoves(this.getValidMoves(piece), true);
      this.selectedPiece = piece;
    } else if (this.board[row][col].isHighlighted) {
      this.displayMoves(this.getValidMoves(this.selectedPiece), false);
      this.move(this.selectedPiece, [row, col]);
      this.selectedPiece = undefined;
    } else {
      this.displayMoves(this.getValidMoves(this.selectedPiece), false);
    }
  }

  move(piece, move) {
    const [row, col] = move;
    const [oldCol, oldRow] = piece.location;
    piece.location = [col, row];
    // Move the piece.
    this.board[row][col].piece = piece;
    this.board[oldRow][oldCol].piece = undefined;

    // Check if the move was a capture. If so, we need to do some work.
    if (Math.abs(row - oldRow) > 1) {
      // Remove the piece inbetween and remove it from its list.
      const enemyList = piece.color == 0 ? this.redPieces : this.blackPieces;
      const enemyCell = this.board[oldRow + (row - oldRow) / 2][oldCol + (col - oldCol) / 2];
      const enemyPiece = enemyCell.piece;
      enemyCell.piece = undefined;

      const idx = enemyList.indexOf(enemyPiece);
      enemyList.splice(idx, 1);
    }
  }

  isValidIndex(i) {
    return i >= 0 && i < 8;
  }
}

export { Board };