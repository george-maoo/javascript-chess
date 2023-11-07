// for all pieces that can move multiple tiles:
/*
for every move in possibleMoves, check every possible move in that direction
until you hit:
  - another piece
    - if piece is same color:
      - dont add the position as a valid move
    - if piece is a enemy:
      - add the enemy piece's location as a valid move
  - move goes out of bounds
*/

const multiMove = (piece) => {
  const { board } = piece;
  const moves = [];

  piece.moveDirections().forEach(([rowDir, colDir]) => {
    let [rowToCheck, colToCheck] = piece.location;

    while (true) {
      rowToCheck += rowDir;
      colToCheck += colDir;
      const posToCheck = [rowToCheck, colToCheck];

      if (!board.isInBounds(posToCheck)) break;

      if (board.atLocation(posToCheck) === null) {
        moves.push(posToCheck);
      } else {
        if (board.atLocation(posToCheck).color !== piece.color) {
          moves.push(posToCheck);
        }
        break;
      }
    }
  });

  return moves;
};

// same as the above, but singleMove will only check the move direction once instead of looping
const singleMove = (piece) => {
  const { board } = piece;
  const moves = [];

  piece.moveDirections().forEach(([rowDir, colDir]) => {
    let [rowToCheck, colToCheck] = piece.location;

    rowToCheck += rowDir;
    colToCheck += colDir;
    const posToCheck = [rowToCheck, colToCheck];

    if (!board.isInBounds(posToCheck)) return;

    if (board.atLocation(posToCheck) === null) {
      moves.push(posToCheck);
    } else {
      if (board.atLocation(posToCheck).color !== piece.color) {
        moves.push(posToCheck);
      }
    }
  });

  return moves;
};

/*
for pawn movement:
allow up to 2 steps forward if at starting position
allow 1 step if not at starting position
allow capturing pieces if there is a enemy piece at the forward diagonal directions of pawn
allow en passant if en passant conditions are met
 */
const pawnMove = (piece) => {
  const { board } = piece;
  const forwardDir = piece.forwardDirection();
  const [row, col] = piece.location;
  const moves = [];

  // forward moves
  const oneStep = [row + forwardDir, col];
  const twoStep = [row + forwardDir * 2, col];

  if (board.isPosEmpty(oneStep)) {
    moves.push(oneStep);
  }

  if (
    board.isPosEmpty(oneStep) &&
    board.isPosEmpty(twoStep) &&
    piece.isAtStart()
  ) {
    moves.push(twoStep);
  }

  // diagonal capture moves
  const leftDiag = [row + forwardDir, col - 1];
  const rightDiag = [row + forwardDir, col + 1];

  const diagMoves = [leftDiag, rightDiag];

  for (const move of diagMoves) {
    if (
      board.isInBounds(move) &&
      board.atLocation(move) !== null &&
      board.atLocation(move).color !== piece.color
    ) {
      moves.push(move);
    }
  }

  // en passant

  /*
  The conditions for a pawn to capture an enemy pawn en passant are as follows:
    * the enemy pawn advanced two squares on the previous turn;
    * the capturing pawn attacks the square that the enemy pawn passed over.

  If these conditions are met, the capturing pawn can move diagonally forward to
  the square that the enemy pawn passed, capturing the enemy pawn as if it had
  moved only one square. If the right to capture en passant is not exercised
  immediately, it is subsequently lost. Making the capture is optional, unless
  there is no other legal move.
   */

  // how many conditions are there for this move...
  if (
    (piece.color === "white" && row === 3) ||
    (piece.color === "black" && row === 4)
  ) {
    const leftSide = [row, col - 1];
    const rightSide = [row, col + 1];

    if (
      board.isInBounds(leftSide) &&
      board.atLocation(leftSide) !== null &&
      board.atLocation(leftSide).color !== piece.color &&
      board.atLocation(leftSide).constructor.name === "Pawn"
    ) {
      if (
        board.atLocation(leftSide).moveCount === 1 &&
        board.atLocation(leftDiag) === null
      ) {
        const y =
          board.previousMoves[board.previousMoves.length - 1].atOldPos.location;
        if (y[0] === leftSide[0] && y[1] === leftSide[1]) {
          moves.push(leftDiag);
        }
      }
    }

    if (
      board.isInBounds(rightSide) &&
      board.atLocation(rightSide) !== null &&
      board.atLocation(rightSide).color !== piece.color &&
      board.atLocation(rightSide).constructor.name === "Pawn"
    ) {
      if (
        board.atLocation(rightSide).moveCount === 1 &&
        board.atLocation(rightDiag) === null
      ) {
        const y =
          board.previousMoves[board.previousMoves.length - 1].atOldPos.location;
        if (y[0] === rightSide[0] && y[1] === rightSide[1]) {
          moves.push(rightDiag);
        }
      }
    }
  }
  return moves;
};

export { singleMove, multiMove, pawnMove };
