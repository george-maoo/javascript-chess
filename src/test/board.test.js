import Board from "../board.js";
import Pawn from "../pieces/pawn.js";
import Bishop from "../pieces/bishop.js";
import Rook from "../pieces/rook.js";
import Knight from "../pieces/knight.js";
import Queen from "../pieces/queen.js";
import King from "../pieces/king.js";

describe("Board", () => {
  describe("initialization", () => {
    test("Board is initially empty", () => {
      const board = new Board();

      expect(board.board).toEqual([
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
      ]);
    });
  });

  describe("atLocation", () => {
    test("Returns whatever is at the position given", () => {
      const board = new Board();
      expect(board.atLocation([3, 4])).toBe(null);
    });
  });

  describe("setLocation", () => {
    test("Can place items in board", () => {
      const board = new Board();
      const p = new Pawn("white", [3, 4]);
      board.setLocation(p, [3, 4]);

      expect(board.board[3][4]).toBe(p);
    });
  });

  describe("isInBounds", () => {
    const board = new Board();

    test("Returns false when location given is out of bounds", () => {
      expect(board.isInBounds([8, 8])).toBe(false);
      expect(board.isInBounds([100, 100])).toBe(false);
    });

    test("Returns true when location given is in bounds", () => {
      expect(board.isInBounds([0, 0])).toBe(true);
      expect(board.isInBounds([7, 0])).toBe(true);
      expect(board.isInBounds([5, 5])).toBe(true);
    });
  });

  describe("posIsEmpty", () => {
    const board = new Board();

    test("Returns false when location given is out of bounds", () => {
      expect(board.posIsEmpty([8, 8])).toBe(false);
      expect(board.posIsEmpty([100, 100])).toBe(false);
    });

    test("Returns true when position is empty", () => {
      expect(board.posIsEmpty([6, 6])).toBe(true);
      expect(board.posIsEmpty([4, 3])).toBe(true);
      expect(board.posIsEmpty([2, 7])).toBe(true);
    });

    test("Returns false when position is not empty", () => {
      board.setLocation(new Pawn("white", [6, 6], board), [6, 6]);
      expect(board.posIsEmpty([6, 6])).toBe(false);
    });
  });

  describe("movePiece", () => {
    test("Returns false if start position is out of bounds", () => {
      const board = new Board();
      board.setLocation(new Queen("white", [6, 1], board), [6, 1]);
      expect(board.movePiece([100, 100], [3, 3])).toBe(false);
    });

    test("returns false if there is no piece at start position", () => {
      const board = new Board();
      board.setLocation(new Queen("white", [6, 1], board), [6, 1]);
      expect(board.movePiece([1, 1], [3, 3])).toBe(false);
    });

    test("returns false and doesnt move piece if end position is not included in the piece's valid moves", () => {
      const board = new Board();
      board.setLocation(new Queen("white", [6, 1], board), [6, 1]);
      expect(board.movePiece([6, 1], [5, 5])).toBe(false);
      expect(board.atLocation([5, 5])).toBe(null);
      expect(board.atLocation([6, 1])).not.toBe(null);
    });

    test("returns false and doesnt move piece if end position is out of bounds", () => {
      const board = new Board();
      board.setLocation(new Queen("white", [6, 1], board), [6, 1]);
      expect(board.movePiece([6, 1], [100, 1])).toBe(false);
      expect(board.atLocation([6, 1])).not.toBe(null);
    });

    test("returns false if move puts your king in check", () => {
      const board = new Board();
      board.setLocation(new Queen("white", [6, 1], board), [6, 1]);
      board.setLocation(new King("white", [7, 1], board), [7, 1]);
      board.setLocation(new Rook("black", [0, 1], board), [0, 1]);

      expect(board.movePiece([6, 1], [6, 2])).toBe(false);
    });

    test("returns true and moves piece if end position is included in the piece's valid moves", () => {
      const board = new Board();
      board.setLocation(new Queen("white", [6, 1], board), [6, 1]);
      expect(board.movePiece([6, 1], [4, 1])).toBe(true);
      expect(board.atLocation([4, 1])).not.toBe(null);
      expect(board.atLocation([6, 1])).toBe(null);
    });
  });

  describe("getPieces", () => {
    describe("When board is empty", () => {
      const board = new Board();

      test("Returns a empty array when board is empty", () => {
        expect(board.getPieces()).toEqual([]);
      });
    });

    describe("When board is not empty", () => {
      const board = new Board();
      board.setLocation(new Pawn("white", [5, 4], board), [5, 4]);
      board.setLocation(new Pawn("white", [4, 4], board), [4, 4]);
      board.setLocation(new Pawn("white", [3, 4], board), [3, 4]);
      board.setLocation(new Pawn("black", [2, 4], board), [2, 4]);
      board.setLocation(new Pawn("black", [1, 4], board), [1, 4]);

      test("Returns an array with length of 5 when there are 5 pieces on the board", () => {
        expect(board.getPieces().length).toBe(5);
      });

      test("Returns an array with 3 white pieces when white is passed in as a argument and 3 white pieces are on board", () => {
        const getPiecesReturnValue = board.getPieces("white");

        expect(getPiecesReturnValue.length).toBe(3);

        getPiecesReturnValue.forEach((piece) => {
          expect(piece instanceof Pawn).toBe(true);
        });
      });

      test("Returns an array with 2 black pieces when there are 2 black pieces and black is passed in as a argument", () => {
        const getPiecesReturnValue = board.getPieces("black");

        expect(getPiecesReturnValue.length).toBe(2);

        getPiecesReturnValue.forEach((piece) => {
          expect(piece instanceof Pawn).toBe(true);
        });
      });
    });
  });

  // describe("undoLastMove", () => {
  //   test("undoes a move to empty space", () => {
  //     const board = new Board();
  //     board.setLocation(new Queen("white", [1, 4], board), [1, 4]);

  //     board.movePiece([1, 4], [3, 4]);
  //     board.undoLastMove();

  //     expect(board.atLocation([1, 4]).color).toBe("white");
  //     expect(board.atLocation([1, 4]) instanceof Queen).toBe(true);
  //   });

  //   test("Correctly undoes a piece capture move", () => {
  //     const board = new Board();
  //     board.setLocation(new Queen("white", [1, 4], board), [1, 4]);
  //     board.setLocation(new Knight("black", [3, 4], board), [3, 4]);

  //     board.movePiece([1, 4], [3, 4]);
  //     board.undoLastMove();

  //     expect(board.atLocation([3, 4]).color).toBe("black");
  //     expect(board.atLocation([3, 4]) instanceof Knight).toBe(true);

  //     expect(board.atLocation([1, 4]).color).toBe("white");
  //     expect(board.atLocation([1, 4]) instanceof Queen).toBe(true);
  //   });

  //   test("Correctly undoes multiple moves", () => {
  //     const board = new Board();
  //     board.setLocation(new Queen("white", [1, 4], board), [1, 4]);
  //     board.setLocation(new Knight("black", [3, 4], board), [3, 4]);

  //     board.movePiece([1, 4], [3, 4]);
  //     board.movePiece([3, 4], [7, 4]);

  //     expect(board.atLocation([7, 4]).color).toBe("white");
  //     expect(board.atLocation([7, 4]) instanceof Queen).toBe(true);

  //     board.undoLastMove();
  //     expect(board.atLocation([3, 4]).color).toBe("white");
  //     expect(board.atLocation([3, 4]) instanceof Queen).toBe(true);

  //     board.undoLastMove();
  //     expect(board.atLocation([1, 4]).color).toBe("white");
  //     expect(board.atLocation([1, 4]) instanceof Queen).toBe(true);

  //     expect(board.atLocation([3, 4]).color).toBe("black");
  //     expect(board.atLocation([3, 4]) instanceof Knight).toBe(true);
  //   });
  // });
});
