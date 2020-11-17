const blackWin = Number.MAX_SAFE_INTEGER
const redWin = Number.MIN_SAFE_INTEGER

class AI {
  constructor(maxDepth) {
    this.maxDepth = maxDepth;
    this.boardStates = 0;
  }

  alphaBeta(board, depth, alpha, beta) {
    // The best move to make with the given board.
    let bestMove = undefined;
    let pieceIdx = undefined;

    // See if the game is over. -1 if no winner yet.
    const winner = board.getWinner();

    if (winner == 0) {
      this.boardStates += 1;
      return [bestMove, pieceIdx, blackWin];
    } else if (winner == 1) {
      this.boardStates += 1;
      return [bestMove, pieceIdx, redWin];
    } else if (depth == 0) {
      this.boardStates += 1;
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

    const shuffledIndices = this.shuffleIndices(board.validMoves.length);
    // Simulate each move.
    for (let i = 0; i < shuffledIndices.length; i++) {
      const idx = shuffledIndices[i];
      const moves = board.validMoves[idx];
      for (let j = 0; j < moves.length; j++) {
        const move = moves[j];
        const copy = board.deepCopy();
        const pieces = copy.turn == 0 ? copy.blackPieces : copy.redPieces;
        copy.move(pieces[idx], move);

        const moveValue = this.alphaBeta(copy, depth - 1, prunerValues[0], prunerValues[1])[2];

        if (comparator(moveValue, localBest)) {
          localBest = moveValue;
          bestMove = move;
          pieceIdx = idx;

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
    // A regular piece has a starting value of 1, and an additional value based on how close it is to being kinged.
    // A kinged piece just needs to have a higher value than that.
    board.blackPieces.forEach(piece => {
      if (!piece.isKing) {
        blackVal += 1 + (board.player == 0 ? piece.location[1] : 7 - piece.location[1]);
      } else {
        blackVal += 10;
      }
    });

    let redVal = 0;
    board.redPieces.forEach(piece => {
      if (!piece.isKing) {
        redVal += 1 + (board.player == 1 ? piece.location[1] : 7 - piece.location[1]);
      } else {
        redVal += 10;
      }
    });

    return blackVal - redVal;
  }

  shuffleIndices(length) {
    const indices = [];
    for (let i = 0; i < length; i++) {
      indices.push(i);
    }

    // Shuffle the indices.
    for (let i = length - 1; i >= 0; i--) {
      const other = Math.floor(Math.random() * i);
      [indices[i], indices[other]] = [indices[other], indices[i]];
    }

    return indices;
  }

  findMove(board) {
    this.boardStates = 0;
    const result = this.alphaBeta(board, this.maxDepth, redWin, blackWin);
    console.log(`Calculated ${this.boardStates} board states.`);
    return [result[1], result[0]];
  }
}

export { AI };
