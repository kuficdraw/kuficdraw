import { Point } from "paper/dist/paper-core";
import { KuficBoardManager } from "../KuficBoardManager";

export class KuficTouch {
  boardManager: KuficBoardManager;
  ///
  isPanning: boolean;
  isZooming: boolean;
  isDrawing: boolean;
  ///
  longTouchDuration: number;
  zoomValue: number;
  startZoomAfter: number;
  ///
  panningOnStartPoint: paper.Point | null;
  startOffsetDistance: number;
  ///
  constructor(boardManager: KuficBoardManager) {
    this.isPanning = true;
    this.isZooming = false;
    this.isDrawing = false;
    this.isDrawing = false;
    ///
    this.longTouchDuration = 1000;
    ///
    this.zoomValue = 0.04;
    this.startZoomAfter = 30;
    ///
    this.panningOnStartPoint = null;
    this.startOffsetDistance = 0;
    ///
    this.boardManager = boardManager;
    ///

    this.boardManager.boardPaperScope.view.element.addEventListener(
      "touchstart",
      (event: globalThis.TouchEvent) => this.handleTouchStart(event)
    );
    this.boardManager.boardPaperScope.view.element.addEventListener(
      "touchmove",
      (event: globalThis.TouchEvent) => this.handleTouchMove(event)
    );
  }

  ///
  handleTouchMove(event: globalThis.TouchEvent) {
    event.preventDefault();
    // only when touch fingers
    if (event.touches.length === 2) {
      /// Pan
      this.handlePan(event);
      /// Zoom
      this.handleZoom(event);
    } else if (event.touches.length === 1) {
      this.handleDrawing(event);
    }
    this.boardManager.updateBoard();
  }
  ///
  handleZoom(event: globalThis.TouchEvent) {
    /////////////
    /// Zoom
    let eventPoint1 = new Point(event.touches[0].pageX, event.touches[0].pageY);
    let eventPoint2 = new Point(event.touches[1].pageX, event.touches[1].pageY);
    let offsetDistance = Math.sqrt(
      (eventPoint1.x - eventPoint2.x) ** 2 +
        (eventPoint1.y - eventPoint2.y) ** 2
    );
    if (
      Math.abs(offsetDistance - this.startOffsetDistance) > this.startZoomAfter
    ) {
      this.isZooming = true;
    }
    if (this.isZooming) {
      var newZoom = this.boardManager.boardPaperScope.view.zoom;
      var oldZoom = this.boardManager.boardPaperScope.view.zoom;

      if (offsetDistance > this.startOffsetDistance) {
        newZoom =
          this.boardManager.boardPaperScope.view.zoom * (1 + this.zoomValue);
      } else {
        newZoom =
          this.boardManager.boardPaperScope.view.zoom * (1 - this.zoomValue);
      }
      ///
      var beta = oldZoom / newZoom;

      var mousePosition = new this.boardManager.boardPaperScope.Point(
        (eventPoint1.x + eventPoint2.x) / 2,
        (eventPoint1.y + eventPoint2.y) / 2
      );

      //viewToProject: gives the coordinates in the Project space from the Screen Coordinates
      var viewPosition = this.boardManager.boardPaperScope.view.viewToProject(
        mousePosition
      );

      var touchPosition = viewPosition;
      var boardCurrentCenter = this.boardManager.boardPaperScope.view.center;

      var pc = touchPosition.subtract(boardCurrentCenter);
      var offset = touchPosition
        .subtract(pc.multiply(beta))
        .subtract(boardCurrentCenter);

      this.boardManager.boardPaperScope.view.zoom = newZoom;
      this.boardManager.boardPaperScope.view.center = this.boardManager.boardPaperScope.view.center.add(
        offset
      );

      ///
      this.startOffsetDistance = offsetDistance;
    }
  }
  ///
  handlePan(event: globalThis.TouchEvent) {
    if (this.isPanning) {
      let eventPoint = new Point(
        event.touches[0].pageX,
        event.touches[0].pageY
      );
      var pan_offset = eventPoint.subtract(this.panningOnStartPoint!);
      this.boardManager.boardPaperScope.view.center = this.boardManager.boardPaperScope.view.center.subtract(
        pan_offset
      );
      this.panningOnStartPoint = eventPoint;
    }
  }
  ///
  handleDrawing(event: globalThis.TouchEvent) {
    this.isPanning = false;
    this.isZooming = false;
    this.isDrawing = true;
    let windowPointDown = new Point(
      event.touches[0].pageX,
      event.touches[0].pageY
    );

    var viewPosition = this.boardManager.boardPaperScope.view.viewToProject(
      windowPointDown
    );

    var touchPosition = viewPosition;
    var boardCurrentCenter = this.boardManager.boardPaperScope.view.center;

    var pc = touchPosition.subtract(boardCurrentCenter);
    var offset = touchPosition.subtract(pc).subtract(boardCurrentCenter);

    this.boardManager.drawRecByCanvasPosition(pc);
  }
  ///
  handleMutliTouchLogic(event: globalThis.TouchEvent) {
    this.isPanning = true;
    this.isZooming = false;
    this.isDrawing = false;
    /// Pan
    this.panningOnStartPoint = new Point(
      event.touches[0].pageX,
      event.touches[0].pageY
    );
    /// Zoom
    let eventPoint1 = new Point(event.touches[0].pageX, event.touches[0].pageY);
    let eventPoint2 = new Point(event.touches[1].pageX, event.touches[1].pageY);
    this.startOffsetDistance = Math.sqrt(
      (eventPoint1.x - eventPoint2.x) ** 2 +
        (eventPoint1.y - eventPoint2.y) ** 2
    );
  }
  ///a
  handleTouchStart(event: globalThis.TouchEvent) {
    event.preventDefault();
    if (event.touches.length === 2) {
      this.handleMutliTouchLogic(event);
    }
    /////////////
    /// Drawing
    else if (event.touches.length === 1) {
      this.handleDrawing(event);
    }
    this.boardManager.updateBoard();
  }
}
