import { json } from "stream/consumers";
import { KuficBoardManager } from "../KuficBoardManager";
export class KuficBrowserStorage {
  boardManager: KuficBoardManager;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
  }
  ///
  // saveBoardToStorage() {
  //   localStorage.setItem(
  //     "board",
  //     JSON.stringify(this.boardManager.boardToStorageBoard())
  //   );
  // }
  ///
  // LoadBoardStorage(): KuficBoard | null {
  //   let loadedBoard = JSON.parse(localStorage.getItem("board")!) as KuficBoard;
  //   if (loadedBoard) {
  //     return loadedBoard;
  //   } else {
  //     return null;
  //   }
  // }
  ///
  ClearStorage() {
    localStorage.clear();
  }
}
