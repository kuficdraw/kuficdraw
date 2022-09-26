import { Path } from "paper/dist/paper-core";
import { title } from "process";
import { DialogMaker } from "../../dialog/DialogMaker";
import { KuficBoardManager } from "../KuficBoardManager";

export class KuficRulerTool {
  boardManager: KuficBoardManager;
  ruler: paper.Path.Line[];
  p1!: paper.Point | null;
  p2!: paper.Point | null;
  p3!: paper.Point | null;
  lastPoint: paper.Point | null;
  currentPoint: paper.Point | null;
  preview!: paper.Path.Line;

  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.ruler = [];
    this.lastPoint = null;
    this.currentPoint = null;
    this.boardManager.kuficRulerTool.on(
      "mousedown",
      (event: paper.MouseEvent) => this.handleMouseDown(event)
    );
    this.boardManager.kuficRulerTool.on(
      "mousemove",
      (event: paper.MouseEvent) => this.handleMouseMove(event)
    );
  }
  handleMouseMove(event: paper.MouseEvent) {
    // if (this.boardManager.boardPaperScope.Key.isDown("shift") && this.p1) {
    //   this.currentPoint = event.point;
    //   this.currentPoint.y = this.lastPoint!.y;
    //   this.drawPreviewLine();
    // } else if (this.boardManager.boardPaperScope.Key.isDown("alt") && this.p1) {
    //   this.currentPoint = event.point;
    //   this.currentPoint.x = this.lastPoint!.x;
    //   this.drawPreviewLine();
    // } else {
    //   this.currentPoint = event.point;
    //   this.drawPreviewLine();
    // }
    this.currentPoint = event.point;
    this.drawPreviewLine();
  }

  handleMouseDown(event: paper.MouseEvent) {
    this.boardManager.tempLayer.activate();
    if (Object(event).event.buttons === 1) {
      /// Draw Area with Shift
      // if (this.boardManager.boardPaperScope.Key.isDown("shift") && this.p1) {
      //   event.point.x = this.lastPoint!.x;
      // } else {
      // }
      if (this.p1) {
        if (this.p2) {
          this.p3 = event.point;
          this.drawLine(this.p3, this.p2);
        } else {
          this.p2 = event.point;
          this.drawLine(this.p1, this.p2);
        }
      } else {
        this.p1 = event.point;
      }
      if (this.p1 && this.p2 && this.p3) {
        this.claculateRatio({ p1: this.p1, p2: this.p2, p3: this.p3 });
      }
      this.lastPoint = event.point;
    }
  }

  drawLine(p1: paper.Point, p2: paper.Point) {
    let line = new Path.Line({
      from: p1,
      to: p2,
      strokeColor: this.boardManager.board.settings.brushColor,
    });
    line.strokeWidth = 5;
    this.ruler.push(line);
  }

  drawPreviewLine() {
    if (this.preview) {
      this.preview.remove();
    }
    if (this.p1) {
      this.preview = new Path.Line({
        from: this.lastPoint,
        to: this.currentPoint,
        strokeColor: this.boardManager.board.settings.brushColor,
      });

      this.preview.strokeWidth = 5;
    }
  }

  reset() {
    this.p1 = null;
    this.p2 = null;
    this.p3 = null;
    this.lastPoint = null;
    this.preview.remove();
    this.drawPreviewLine();
    this.ruler.forEach((line) => line.remove());
    this.ruler = [];
  }

  claculateRatio({
    p1,
    p2,
    p3,
  }: {
    p1: paper.Point;
    p2: paper.Point;
    p3: paper.Point;
  }) {
    let dist1: number = p1.getDistance(p2);
    let dist2: number = p2.getDistance(p3);
    let massLength: number = 0;
    let voidLength: number = 0;

    if (dist1 > dist2) {
      massLength = (dist1 / dist1) * 100;
      voidLength = (dist2 / dist1) * 100;
    } else {
      voidLength = (dist1 / dist2) * 100;
      massLength = (dist2 / dist2) * 100;
    }
    DialogMaker.showMsg(
      "معلومات التكوين",
      `الكتلـــة: ${massLength}\n\nالفـــراغ: ${Math.floor(voidLength)}`
    );
    this.reset();
  }
}
