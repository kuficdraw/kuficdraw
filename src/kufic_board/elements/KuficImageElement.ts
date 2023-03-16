import { Point, Raster } from "paper/dist/paper-core";
import { KuficBoardManager } from "../KuficBoardManager";
import { Attachment } from "../types/attachment";

export class KuficImageElement {
  boardManager: KuficBoardManager;
  attach: Attachment;
  raster!: paper.Raster;
  mouseStart!: paper.Point;
  diffranceFromMouseToCenter!: paper.Point;
  constructor({
    attach,
    boardManager,
  }: {
    attach: Attachment;
    boardManager: KuficBoardManager;
  }) {
    this.attach = attach;
    this.boardManager = boardManager;

    this.boardManager.attachmentLayer.activate();
    this.raster = new Raster({
      source: this.attach.base64,
      position: new Point(this.attach.x, this.attach.y),
    });
    this.raster.scaling = new Point(
      this.attach.scaling.x,
      this.attach.scaling.y
    );
    this.raster.rotation = this.attach.rotatation;

    this.raster.on("mousedrag", (event: paper.MouseEvent) =>
      this.mouseDrag(event)
    );
    this.raster.on("mouseup", (event: paper.MouseEvent) => this.mouseUp(event));
    this.raster.on("mousedown", (event: paper.MouseEvent) =>
      this.mouseDown(event)
    );
    this.raster.on("doubleclick", (event: paper.MouseEvent) =>
      this.doubleClick(event)
    );
  }
  doubleClick(event: paper.MouseEvent) {
    this.raster.selected = false;
  }

  mouseDown(mouseDown: paper.MouseEvent) {
    if (
      this.boardManager.boardPaperScope.tool !== this.boardManager.kuficMoveTool
    ) {
      return;
    }
    this.raster.selected = true;
    this.mouseStart = mouseDown.point;
    this.diffranceFromMouseToCenter = this.raster.bounds.center.subtract(
      this.mouseStart
    );
  }

  mouseUp(mouseUp: paper.MouseEvent) {
    if (
      this.boardManager.boardPaperScope.tool !== this.boardManager.kuficMoveTool
    ) {
      return;
    }
    // this.raster.selected = false;
  }
  mouseDrag(mouseDrag: paper.MouseEvent) {
    if (
      this.boardManager.boardPaperScope.tool !== this.boardManager.kuficMoveTool
    ) {
      return;
    }

    ///////// scale
    if (Object(mouseDrag).event.buttons === 2) {
      this.scale(mouseDrag);
    }

    ///////// Move & Rotate
    else if (Object(mouseDrag).event.buttons === 1) {
      ///////// Rotate
      if (this.boardManager.boardPaperScope.Key.isDown("shift")) {
        this.rotate(mouseDrag);
      }

      ///////// ChangeTransparent
      else if (this.boardManager.boardPaperScope.Key.isDown("alt")) {
        this.opcityChange(mouseDrag);
      }
      ///////// Move
      else {
        this.move(mouseDrag);
      }
    }
  }

  opcityChange(mouseDrag: paper.MouseEvent) {
    let effectSign = 1;
    let affectBy = 1;
    if (this.mouseStart!.x > this.raster.bounds.center.x) {
      if (mouseDrag.point.y > this.mouseStart!.y) {
        effectSign = 1;
      } else {
        effectSign = -1;
      }
    } else if (this.mouseStart!.x < this.raster.bounds.center.x) {
      if (mouseDrag.point.y > this.mouseStart!.y) {
        effectSign = -1;
      } else {
        effectSign = 1;
      }
    }
    let opcity: number = 0;
    opcity += effectSign * affectBy;
    if (opcity < 0) {
      opcity = 0;
    } else if (opcity > 100) {
      opcity = 100;
    }
  }

  move(mouseDrag: paper.MouseEvent) {
    this.raster.bounds.center = mouseDrag.point.add(
      this.diffranceFromMouseToCenter
    );
  }

  rotate(mouseDrag: paper.MouseEvent) {
    ///////// Rotate
    let rotateBy = 0;
    let rotateDirection = 1;
    ///
    if (this.mouseStart!.y > this.raster.bounds.center.y) {
      if (mouseDrag.point.x > this.mouseStart!.x) {
        rotateDirection = -1;
      } else {
        rotateDirection = 1;
      }
    } else if (this.mouseStart!.y < this.raster.bounds.center.y) {
      if (mouseDrag.point.x > this.mouseStart!.x) {
        rotateDirection = 1;
      } else {
        rotateDirection = -1;
      }
    }
    ///
    if (this.mouseStart!.x > this.raster.bounds.center.x) {
      if (mouseDrag.point.y > this.mouseStart!.y) {
        rotateDirection = 1;
      } else {
        rotateDirection = -1;
      }
    } else if (this.mouseStart!.x < this.raster.bounds.center.x) {
      if (mouseDrag.point.y > this.mouseStart!.y) {
        rotateDirection = -1;
      } else {
        rotateDirection = 1;
      }
    }

    rotateBy = 1;
    if (this.boardManager.boardPaperScope.Key.isDown("control")) {
      rotateBy = 15;
    }
    this.raster.rotation += rotateBy * rotateDirection;
  }

  scale(mouseDrag: paper.MouseEvent) {
    let selectionRectangleScale = this.diffranceFromMouseToCenter.length;
    let ratio =
      mouseDrag.point.subtract(this.raster.bounds.center).length /
      selectionRectangleScale;
    let scaling = new Point(ratio, ratio);
    this.raster.scaling = scaling;
  }
}
