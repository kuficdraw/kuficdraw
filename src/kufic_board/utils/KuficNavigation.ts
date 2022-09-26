import { KuficBoardManager } from "../KuficBoardManager";
export class KuficNavigation {
  boardManager: KuficBoardManager;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.pan();
    this.zoom();
  }
  // Pan grid
  pan() {
    let downPoint: paper.Point;
    // Create a simple drawing tool:
    this.boardManager.boardPaperScope.view.on(
      "mousedown",
      (event: paper.MouseEvent) => {
        // Scroll Button
        if (Object(event).event.buttons === 4) {
          downPoint = event.point;
          event.preventDefault();
        }
      }
    );
    this.boardManager.boardPaperScope.view.on(
      "mouseup",
      (event: paper.MouseEvent) => {
        this.boardManager.setCursorToCurrentMode();
      }
    );
    this.boardManager.boardPaperScope.view.on(
      "doubleclick",
      (event: paper.MouseEvent) => {
        if (Object(event).event.button === 1) {
          this.boardManager.fitToScreen();
        }
      }
    );

    this.boardManager.boardPaperScope.view.on(
      "mousedrag",
      (event: paper.MouseEvent) => {
        // Scroll Button
        if (Object(event).event.buttons === 4) {
          this.boardManager.setCursor("pan");

          var pan_offset = event.point.subtract(downPoint);
          this.boardManager.boardPaperScope.view.center = this.boardManager.boardPaperScope.view.center.subtract(
            pan_offset
          );
          event.preventDefault();
          this.boardManager.updateBoard();
        }
      }
    );
  }

  // Zoom grid
  zoom() {
    this.boardManager.boardPaperScope.view.element.onwheel = (
      event: WheelEvent
    ) => {
      var newZoom = this.boardManager.boardPaperScope.view.zoom;
      var oldZoom = this.boardManager.boardPaperScope.view.zoom;

      if (event.deltaY < 0) {
        newZoom = this.boardManager.boardPaperScope.view.zoom * 1.05;
      } else {
        newZoom = this.boardManager.boardPaperScope.view.zoom * 0.95;
      }

      var beta = oldZoom / newZoom;

      var mousePosition = new this.boardManager.boardPaperScope.Point(
        event.offsetX,
        event.offsetY
      );

      //viewToProject: gives the coordinates in the Project space from the Screen Coordinates
      var viewPosition = this.boardManager.boardPaperScope.view.viewToProject(
        mousePosition
      );

      var mpos = viewPosition;
      var ctr = this.boardManager.boardPaperScope.view.center;

      var pc = mpos.subtract(ctr);
      var offset = mpos.subtract(pc.multiply(beta)).subtract(ctr);

      this.boardManager.boardPaperScope.view.zoom = newZoom;
      this.boardManager.boardPaperScope.view.center = this.boardManager.boardPaperScope.view.center.add(
        offset
      );
      this.boardManager.updateBoard();
      this.boardManager.drawRefenceToMouseCursor(true, true);

      event.preventDefault();
    };
  }
}
