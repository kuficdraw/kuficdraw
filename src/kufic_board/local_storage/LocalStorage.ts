import { KuficBoard } from "../types/kuficBoard";

export class KuficLocalStorage {
  static saveBoard(board: KuficBoard) {
    const data = JSON.stringify(board);
    localStorage.setItem("board", data);
  }

  static getBoard(): KuficBoard | null {
    const data = localStorage.getItem("board");
    if (data !== null) {
      const board = JSON.parse(data) as KuficBoard;
      return board;
    }
    return null;
  }
}
