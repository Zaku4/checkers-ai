import { Piece } from './piece.js';
import { Cell } from './cell.js';

class Board {
  constructor(cellWidth, player, doSetup) {
    this.cellWidth = cellWidth;
    this.board = [];
    this.turn = 0; // 0 for first player, 1 for second player.
    this.player = player; // 0 if the user is black, 1 if the user is red.
    this.selectedPiece = undefined;
    this.validMoves = undefined;
    this.blackPieces = [];
    this.redPieces = [];

    // Create the board.
    for (let row = 0; row < 8; row++) {
      const columns = []
      for (let col = 0; col < 8; col++) {
        columns.push(new Cell([col, row], this.cellWidth));
      }
      this.board.push(columns);
    }


    if (doSetup) {
      const playerPieces = this.player == 0 ? this.blackPieces : this.redPieces;
      const cpuPieces = this.player == 0 ? this.redPieces : this.blackPieces; 
      // Place starting player pieces.
      for (let row = 5; row < 8; row++) {
        for (let col = row % 2; col < 8; col += 2) {
          const piece = new Piece(this.player, [col, row], this.cellWidth);
          this.board[row][col].piece = piece;
          playerPieces.push(piece);
        }
      }

      // Place starting cpu pieces.
      for (let row = 0; row < 3; row++) {
        for (let col = row % 2; col < 8; col += 2) {
          const piece = new Piece(1 - this.player, [col, row], this.cellWidth);
          this.board[row][col].piece = piece;
          cpuPieces.push(piece);
        }
      }

      this.updateValidMoves();
    }
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
        if (Math.abs(move[0] - pieces[i].location[1]) > 1) {
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
        moves[i] = moves[i].filter(move => Math.abs(move[0] - pieces[i].location[1]) > 1);
      }
    }

    return moves;
  }

  getValidMoves(piece) {
    const [col, row] = piece.location;

    // Directions represents in which directions we should check for valid moves.
    const directions = [];
    // Black moves upwards.
    directions.push(piece.color == this.player ? -1 : 1);

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
    if (piece && piece.color == this.turn) {
      if (this.selectedPiece) {
        this.displayMoves(this.getValidMoves(this.selectedPiece), false);
      }

      const pieces = this.turn == 0 ? this.blackPieces : this.redPieces;
      const idx = pieces.indexOf(piece);
      const moves = this.validMoves[idx];
      this.displayMoves(moves, true);
      this.selectedPiece = piece;
    } else if (this.board[row][col].isHighlighted) {
      this.displayMoves(this.getValidMoves(this.selectedPiece), false);
      this.move(this.selectedPiece, [row, col]);
      this.selectedPiece = undefined;
    } else {
      if (this.selectedPiece) {
        this.displayMoves(this.getValidMoves(this.selectedPiece), false);
      }
    }
  }

  move(piece, move) {
    const [row, col] = move;
    const [oldCol, oldRow] = piece.location;
    piece.location = [col, row];
    // Move the piece.
    this.board[row][col].piece = piece;
    this.board[oldRow][oldCol].piece = undefined;

    // True if the moved piece just captured a piece and can keep capturing.
    let hasMoreCaptures = false;

    // Check if the move was a capture. If so, we need to do some work.
    if (Math.abs(row - oldRow) > 1) {
      // Remove the piece inbetween and remove it from its list.
      const enemyList = piece.color == 0 ? this.redPieces : this.blackPieces;
      const enemyCell = this.board[oldRow + (row - oldRow) / 2][oldCol + (col - oldCol) / 2];
      const enemyPiece = enemyCell.piece;
      enemyCell.piece = undefined;

      let idx = enemyList.indexOf(enemyPiece);
      enemyList.splice(idx, 1);

      // Check and see if that moved piece can do more captures.
      const otherMoves = this.getValidMoves(piece);
      for (let i = 0; i < otherMoves.length; i++) {
        if (Math.abs(otherMoves[i][0] - row) > 1) {
          hasMoreCaptures = true;
          break;
        }
      } 

      // If we have more captures, this piece must continue its captures so all other valid moves are erased.
      if (hasMoreCaptures) {
        const pieceList = piece.color == 0 ? this.blackPieces : this.redPieces;
        idx = pieceList.indexOf(piece);
       
        for (let i = 0; i < this.validMoves.length; i++) {
          this.validMoves[i] = [];
        }

        this.validMoves[idx] = otherMoves;
      }
    }

    // We only switch turns if the moved piece has no more captures.
    if (!hasMoreCaptures) {
      this.turn = 1 - this.turn
      // If the piece reached the other side, king it.
      const otherSide = piece.color == this.player ? 0 : 7;
      if (row == otherSide) {
        piece.isKing = true;
      }
      // Update the valid moves.
      this.updateValidMoves();
    }
  }

  // Please forgive me for this sin, but I just want to get this working.
  makeAIMove(idx, move) {
    const pieces = this.turn == 0 ? this.blackPieces : this.redPieces;
    this.move(pieces[idx], move);
  }

  deepCopy() {
    const copy = new Board(this.cellWidth, this.player, false);
    copy.turn = this.turn;
    this.blackPieces.forEach(piece => {
      const copyPiece = piece.deepCopy();
      const [col, row] = copyPiece.location;
      copy.board[row][col].piece = copyPiece;
      copy.blackPieces.push(copyPiece);
    });

    this.redPieces.forEach(piece => {
      const copyPiece = piece.deepCopy();
      const [col, row] = copyPiece.location;
      copy.board[row][col].piece = copyPiece;
      copy.redPieces.push(copyPiece);
    });

    copy.validMoves = [...this.validMoves]; 

    return copy;
  }


  getWinner() {
    if (this.validMoves.length != 0) {
      return -1;
    } else {
      return 1 - this.turn;
    }
  }

  isValidIndex(i) {
    return i >= 0 && i < 8;
  }
}

export { Board };