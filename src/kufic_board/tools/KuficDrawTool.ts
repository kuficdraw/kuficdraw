import { Layer, Point } from "paper/dist/paper-core";
import { KuficBoardManager } from "../KuficBoardManager";
import { KuficLocalStorage } from "../local_storage/LocalStorage";

export class KuficDrawTool {
  boardManager: KuficBoardManager;
  currentMousePosition: paper.Point;
  lastMousePosition: paper.Point | null;
  previewLayer: paper.Layer | null;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.previewLayer = new Layer();
    this.currentMousePosition = new Point(0, 0);
    this.lastMousePosition = null;
    this.boardManager.kuficDrawTool.on("mousedown", (event: paper.MouseEvent) =>
      this.handleMouseDown(event)
    );
    this.boardManager.kuficDrawTool.on("mousedrag", (event: paper.MouseEvent) =>
      this.handleMouseDown(event)
    );
    this.boardManager.kuficDrawTool.on("mousemove", (event: paper.MouseEvent) =>
      this.handleMouseMove(event)
    );
    this.boardManager.kuficDrawTool.on("mouseup", (event: paper.MouseEvent) =>
      this.handleMouseUp(event)
    );
    this.boardManager.kuficDrawTool.on(
      "mouseleave",
      (event: paper.MouseEvent) => this.handleMouseLeave(event)
    );
  }
  async handleMouseUp(event: paper.MouseEvent) {
    this.boardManager.setCursorToCurrentMode();

    await this.boardManager.prepareBoardToExport();
    KuficLocalStorage.saveBoard(this.boardManager.board);
  }

  handleMouseLeave(event: paper.MouseEvent) {
    this.boardManager.tempLayer.removeChildren();
  }

  drawAreaBorder(event: paper.MouseEvent) {
    if (this.lastMousePosition === null) {
      this.lastMousePosition = event.point;
    } else {
      this.boardManager.kuficMath.getRecInArea({
        start: this.lastMousePosition!,
        end: event.point,
        fill: false,
        doForEveryCell: (point: paper.Point) => {
          this.boardManager.drawRecByBoardUnit({
            color: this.boardManager.board.settings.brushColor,
            pos: { x: point.x, y: point.y },
          });
        },
      });
      this.lastMousePosition = event.point;
    }
  }
  drawAreaFilled(event: paper.MouseEvent) {
    if (this.lastMousePosition === null) {
      this.lastMousePosition = event.point;
    } else {
      this.boardManager.kuficMath.getRecInArea({
        start: this.lastMousePosition!,
        end: event.point,
        fill: true,
        doForEveryCell: (point: paper.Point) => {
          this.boardManager.drawRecByBoardUnit({
            color: this.boardManager.board.settings.brushColor,
            pos: { x: point.x, y: point.y },
          });
        },
      });
      this.lastMousePosition = event.point;
    }
  }
  removeAreaBorder(event: paper.MouseEvent) {
    if (this.lastMousePosition === null) {
      this.lastMousePosition = event.point;
    } else {
      this.boardManager.kuficMath.getRecInArea({
        start: this.lastMousePosition!,
        end: event.point,
        fill: false,
        doForEveryCell: (point: paper.Point) => {
          let _point = this.boardManager.kuficMath.getPointFromBoardUnit({
            cordX: point.x,
            cordY: point.y,
          });
          this.boardManager.removeAtPoint(_point);
        },
      });

      this.lastMousePosition = event.point;
    }
  }
  removeAreaFilled(event: paper.MouseEvent) {
    if (this.lastMousePosition === null) {
      this.lastMousePosition = event.point;
    } else {
      this.boardManager.kuficMath.getRecInArea({
        start: this.lastMousePosition!,
        end: event.point,
        fill: true,
        doForEveryCell: (point: paper.Point) => {
          let _point = this.boardManager.kuficMath.getPointFromBoardUnit({
            cordX: point.x,
            cordY: point.y,
          });

          this.boardManager.removeAtPoint(_point);
        },
      });
      this.lastMousePosition = event.point;
    }
  }
  handleMouseDown(event: paper.MouseEvent) {
    // this.boardManager.tempLayer.removeChildren();
    this.handleMouseMove(event);
    // Object(event).event.preventDefault();
    // event.preventDefault();

    if (Object(event).event.buttons === 1) {
      this.boardManager.drawRecByCanvasPosition(event.point);
      /// Draw Area with Shift
      if (this.boardManager.boardPaperScope.Key.isDown("shift")) {
        this.drawAreaBorder(event);
      } else if (this.boardManager.boardPaperScope.Key.isDown("alt")) {
        this.drawAreaFilled(event);
      } else {
        this.lastMousePosition = event.point;
      }
    }
    // Right
    else if (Object(event).event.buttons === 2) {
      this.boardManager.boardPaperScope.view.element.setAttribute(
        "data-cursor",
        "wipe"
      );
      let hit = this.boardManager.cellsLayer.hitTest(event.point);
      if (hit) {
        this.boardManager.removeAtPoint(event.point);
      }
      ///  Remove with Shift
      if (this.boardManager.boardPaperScope.Key.isDown("shift")) {
        this.removeAreaBorder(event);
      } else if (this.boardManager.boardPaperScope.Key.isDown("alt")) {
        this.removeAreaFilled(event);
      } else {
        this.lastMousePosition = event.point;
      }
    }
    // Scroll Button
    else if (Object(event).event.buttons === 4) {
    }
  }

  handleMouseMove(event: paper.MouseEvent) {
    if (Object(event).event.buttons === 2) {
      this.boardManager.drawRefenceToPoint(event.point, false, true);
      return;
    }
    this.boardManager.drawRefenceToPoint(event.point, true, true);
  }
}
