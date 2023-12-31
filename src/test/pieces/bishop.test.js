import Board from "../../board.js";
import Bishop from "../../pieces/bishop.js";
import Pawn from "../../pieces/pawn.js";
import { possibleMovesValidator } from "./helper.js";

describe("Bishop", () => {
  // in expectedPossibleMoves, a 1 represents a valid move, a 0 represents invalid move
  describe("Bishop movement", () => {
    test("Can move diagonally when placed in middle of empty board", () => {
      const board = new Board();
      board.setLocation(new Bishop("white", [4, 4], board), [4, 4]);

      const possibleMoves = board.atLocation([4, 4]).possibleMoves();
      const expectedPossibleMoves = [
        [1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 1],
      ];

      expect(possibleMovesValidator(expectedPossibleMoves, possibleMoves)).toBe(
        true
      );
    });

    test("Can only move diagonally towards bottom left when placed in row 0, column 7", () => {
      const board = new Board();
      board.setLocation(new Bishop("white", [0, 7], board), [0, 7]);

      const possibleMoves = board.atLocation([0, 7]).possibleMoves();
      const expectedPossibleMoves = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(possibleMovesValidator(expectedPossibleMoves, possibleMoves)).toBe(
        true
      );
    });

    test("Cant move over/move on piece of same color", () => {
      const board = new Board();
      board.setLocation(new Bishop("white", [4, 4], board), [4, 4]);

      board.setLocation(new Pawn("white", [2, 2], board), [2, 2]);
      board.setLocation(new Pawn("white", [6, 2], board), [6, 2]);
      board.setLocation(new Pawn("white", [7, 7], board), [7, 7]);

      const possibleMoves = board.atLocation([4, 4]).possibleMoves();
      const expectedPossibleMoves = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ];

      expect(possibleMovesValidator(expectedPossibleMoves, possibleMoves)).toBe(
        true
      );
    });

    test("Can move on enemy piece but not over them", () => {
      const board = new Board();
      board.setLocation(new Bishop("white", [4, 4], board), [4, 4]);

      board.setLocation(new Pawn("black", [2, 2], board), [2, 2]);
      board.setLocation(new Pawn("black", [6, 2], board), [6, 2]);
      board.setLocation(new Pawn("black", [7, 7], board), [7, 7]);

      const possibleMoves = board.atLocation([4, 4]).possibleMoves();
      const expectedPossibleMoves = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1],
      ];

      expect(possibleMovesValidator(expectedPossibleMoves, possibleMoves)).toBe(
        true
      );
    });
  });
});
