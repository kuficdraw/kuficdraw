import { KuficBoardManager } from "../KuficBoardManager";

export class KuficMoveTool {
  boardManager: KuficBoardManager;

  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.boardManager.kuficMoveTool.on("keydown", (event: paper.KeyEvent) =>
      this.handleKeyDown(event)
    );
  }
  handleKeyDown(event: paper.KeyEvent) {
    switch (event.key) {
      case "delete":
        this.boardManager.attachmentLayer
          .getItems({ selected: true })
          .forEach((_item) => _item.remove());
        break;

      default:
        break;
    }
  }
}
