import { KuficBoardManager } from "../KuficBoardManager";

export class KuficSelctTool {
  boardManager: KuficBoardManager;
  startPoint: paper.Point | null;
  endPoint: paper.Point | null;
  selectedItems: paper.Path[];
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.startPoint = null;
    this.endPoint = null;
    this.selectedItems = [];

    this.boardManager.kuficSelectTool.on(
      "mousedown",
      (event: paper.MouseEvent) => this.handleMouseDown(event)
    );
    this.boardManager.kuficSelectTool.on(
      "mousedrag",
      (event: paper.MouseEvent) => this.handleMouseDrag(event)
    );
    this.boardManager.kuficSelectTool.on("mouseup", (event: paper.MouseEvent) =>
      this.handleMouseUp(event)
    );
    this.boardManager.kuficSelectTool.on(
      "doubleclick",
      (event: paper.MouseEvent) => this.handleMouseDoubleClick(event)
    );
    this.boardManager.kuficSelectTool.on("keydown", (event: paper.KeyEvent) =>
      this.handleKeyDown(event)
    );
  }
  handleKeyDown(event: paper.KeyEvent) {
    if (Object(event).event.ctrlKey) {
      switch (event.key) {
        case "escape":
          this.cancelSelection();
          break;
        case "a":
          this.boardManager.cellsLayer.getItems({}).forEach((_item) => {
            _item.selected = true;
          });
          break;

        default:
          break;
      }
    } else {
      switch (event.key) {
        case "escape":
          this.cancelSelection();
          break;
        case "delete":
          this.boardManager.cellsLayer
            .getItems({ selected: true })
            .forEach((_item) => _item.remove());
          this.boardManager.attachmentLayer
            .getItems({ selected: true })
            .forEach((_item) => _item.remove());
          break;

        default:
          break;
      }
    }
  }
  handleMouseDoubleClick(event: paper.MouseEvent) {
    if (Object(event).event.button === 0) {
      this.cancelSelection();
    }
  }
  handleMouseDrag(event: paper.MouseEvent) {
    if (Object(event).event.button === 0 && Object(event).event.buttons === 1) {
      this.boardManager.tempLayer.removeChildren();
      this.boardManager.tempLayer.activate();

      let rectangle = new this.boardManager.boardPaperScope.Rectangle(
        this.startPoint!,
        event.point
      );
      let path1 = new this.boardManager.boardPaperScope.Path.Rectangle(
        rectangle
      );
      path1.fillColor = new this.boardManager.boardPaperScope.Color("blue");
      path1.opacity = 0.05;
      let path2 = new this.boardManager.boardPaperScope.Path.Rectangle(
        rectangle
      );
      path2.strokeColor = new this.boardManager.boardPaperScope.Color("red");
      path2.strokeWidth = 1;
      path2.dashArray = [5, 5];
    }
  }
  ///
  handleMouseUp(event: paper.MouseEvent) {
    this.boardManager.tempLayer.removeChildren();
    if (Object(event).event.button === 0) {
      this.endPoint = event.point;
      if (this.endPoint && this.startPoint) {
        let bound = new this.boardManager.boardPaperScope.Rectangle({
          from: this.startPoint,
          to: this.endPoint,
        });
        this.boardManager.cellsLayer.getItems({}).forEach((_item) => {
          if (_item.isInside(bound)) {
            _item.selected = true;
          }
        });
      }

      this.endPoint = null;
      this.startPoint = null;
    }
  }
  ///
  handleMouseDown(event: paper.MouseEvent) {
    if (Object(event).event.button === 2) {
      this.cancelSelection();
    }
    this.boardManager.tempLayer.removeChildren();
    if (Object(event).event.button === 0) {
      this.startPoint = event.point;
    }
  }
  ///
  cancelSelection() {
    this.boardManager.cellsLayer
      .getItems({ selected: true })
      .forEach((_item) => (_item.selected = false));
  }
}
