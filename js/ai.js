const blackWin = Number.MAX_SAFE_INTEGER
const redWin = Number.MIN_SAFE_INTEGER

class AI {
  constructor(maxDepth) {
    this.maxDepth = maxDepth;
  }

  alphaBeta(board, depth, alpha, beta) {
    // The best move to make with the given board.
    let bestMove = undefined;
    let pieceIdx = undefined;

    // See if the game is over. -1 if no winner yet.
    const winner = board.getWinner();

    if (winner == 0) {
      return [bestMove, pieceIdx, blackWin];
    } else if (winner == 1) {
      return [bestMove, pieceIdx, redWin];
    } else if (depth == 0) {
      return [bestMove, pieceIdx, this.heuristic(board)]
    }

    // These values will vary depending on whose turn it is.
    let comparator, localBest, prunerIdx;
    const prunerValues = [alpha, beta];

    if (board.turn == 0) {
      comparator = (score, best) => score > best;
      localBest = redWin - 1;
      prunerIdx = 0;
    } else {
      comparator = (score, best) => score < best;
      localBest = blackWin + 1;
      prunerIdx = 1;
    }

    // Simulate each move.
    for (let i = 0; i < board.validMoves.length; i++) {
      const moves = board.validMoves[i];
      for (let j = 0; j < moves.length; j++) {
        const move = moves[j];
        const copy = board.deepCopy();
        const pieces = copy.turn == 0 ? copy.blackPieces : copy.redPieces;
        copy.move(pieces[i], move);

        const moveValue = this.alphaBeta(copy, depth - 1, prunerValues[0], prunerValues[1])[2];

        if (comparator(moveValue, localBest)) {
          localBest = moveValue;
          bestMove = move;
          pieceIdx = i;

          if (comparator(localBest, prunerValues[prunerIdx])) {
            prunerValues[prunerIdx] = localBest;
            const pruner1 = prunerValues[prunerIdx];
            const pruner2 = prunerValues[1 - prunerIdx];

            // Perform alpha-beta pruning step.
            if (comparator(pruner1, pruner2) || pruner1 == pruner2) {
              break;
            }
          }
        }
      }
    }

    return [bestMove, pieceIdx, localBest];
  }

  heuristic(board) {
    let blackVal = 0;
    board.blackPieces.forEach(piece => {
      blackVal += piece.isKing ? 2 : 1;
    });

    let redVal = 0;
    board.redPieces.forEach(piece => {
      redVal += piece.isKing ? 2 : 1;
    });

    return blackVal - redVal;
  }

  findMove(board) {
    const result = this.alphaBeta(board, this.maxDepth, redWin, blackWin);
    if (!result[0]) {
      console.log(result);
    }
    return [result[1], result[0]];
  }
}

export { AI };