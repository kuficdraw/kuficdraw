import { Point } from "paper/dist/paper-core";
import { KuficBoardManager } from "../KuficBoardManager";

export class KuficMath {
  boardManager: KuficBoardManager;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
  }
  ///
  getPointFromBoardUnit({
    cordX,
    cordY,
  }: {
    cordX: number;
    cordY: number;
  }): paper.Point {
    let total =
      this.boardManager.board.settings.mass +
      this.boardManager.board.settings.void;
    let x, y;
    let cordXSign = cordX / Math.abs(cordX);
    let cordYSign = cordY / Math.abs(cordY);
    ///
    if (cordXSign > 0) {
      if (cordX % 2 === 0) {
        x =
          Math.trunc(cordX / 2) * total - this.boardManager.board.settings.void;
      } else {
        x = Math.trunc(cordX / 2) * total;
      }
    } else {
      if (cordX % 2 === 0) {
        x = Math.trunc(cordX / 2) * total;
      } else {
        x =
          Math.trunc(cordX / 2) * total - this.boardManager.board.settings.void;
      }
    }
    ///
    if (cordYSign > 0) {
      if (cordY % 2 === 0) {
        y =
          Math.trunc(cordY / 2) * total - this.boardManager.board.settings.void;
      } else {
        y = Math.trunc(cordY / 2) * total;
      }
    } else {
      if (cordY % 2 === 0) {
        y = Math.trunc(cordY / 2) * total;
      } else {
        y =
          Math.trunc(cordY / 2) * total - this.boardManager.board.settings.void;
      }
    }
    return new Point(x, y);
  }
  ///
  getBoardUnitFromPoint({ point }: { point: paper.Point }): paper.Point | null {
    if (point) {
      let total =
        this.boardManager.board.settings.mass +
        this.boardManager.board.settings.void;
      let boardX, boardY;
      ///
      let snapped = this.positionSnapCalculation(point.x, point.y);
      ///
      let snappedXSign = snapped.canvasX / Math.abs(snapped.canvasX);
      let snappedYSign = snapped.canvasY / Math.abs(snapped.canvasY);
      ///
      let snapModToataX = snapped.canvasX % total;
      let snapModToataY = snapped.canvasY % total;
      /// X
      if (snappedXSign > 0) {
        if (snapModToataX === 0) {
          boardX = (snapped.canvasX / total) * 2 + 1;
        } else {
          boardX = Math.floor(snapped.canvasX / total) * 2 + 2;
        }
      } else if (snappedXSign < 0) {
        if (snapModToataX === 0) {
          boardX = snappedXSign * ((Math.abs(snapped.canvasX) / total) * 2);
        } else {
          boardX =
            snappedXSign *
            (Math.floor(Math.abs(snapped.canvasX) / total) * 2 + 1);
        }
      } else {
        boardX = 1;
      }

      /// Y
      if (snappedYSign > 0) {
        if (snapModToataY === 0) {
          boardY = (snapped.canvasY / total) * 2 + 1;
        } else {
          boardY = Math.floor(snapped.canvasY / total) * 2 + 2;
        }
      } else if (snappedYSign < 0) {
        if (snapModToataY === 0) {
          boardY = snappedYSign * ((Math.abs(snapped.canvasY) / total) * 2);
        } else {
          boardY =
            snappedYSign *
            (Math.floor(Math.abs(snapped.canvasY) / total) * 2 + 1);
        }
      } else {
        boardY = 1;
      }
      return new Point(boardX, boardY);
    } else {
      return null;
    }
  }
  ///
  positionSnapCalculation(canvasX: number, canvasY: number) {
    let totalSize =
      this.boardManager.board.settings.mass +
      this.boardManager.board.settings.void;
    let snapX = null,
      snapY = null;
    // X
    let signX = canvasX / Math.abs(canvasX); // 0
    let totalCountX = Math.abs(Math.trunc(canvasX / totalSize)); //0
    let resetLengthX = Math.abs(canvasX % totalSize); //0
    // Y
    let signY = canvasY / Math.abs(canvasY);
    let totalCountY = Math.abs(Math.trunc(canvasY / totalSize));
    let resetLengthY = Math.abs(canvasY % totalSize);
    ///
    if (resetLengthX === 0 && resetLengthY === 0) {
      return { canvasX: canvasX, canvasY: canvasY };
    }
    // X Calculation
    if (snapX === null) {
      if (signX > 0) {
        if (resetLengthX > this.boardManager.board.settings.mass) {
          snapX =
            Math.abs(totalCountX) * totalSize +
            this.boardManager.board.settings.mass;
        } else if (resetLengthX < this.boardManager.board.settings.mass) {
          snapX = Math.abs(totalCountX) * totalSize;
        } else {
          snapX =
            Math.abs(totalCountX) * totalSize +
            this.boardManager.board.settings.mass;
        }
      } else if (signX < 0) {
        if (resetLengthX > this.boardManager.board.settings.void) {
          snapX = signX * (Math.abs(totalCountX) * totalSize + totalSize);
        } else if (resetLengthX < this.boardManager.board.settings.void) {
          snapX =
            signX *
            (Math.abs(totalCountX) * totalSize +
              this.boardManager.board.settings.void);
        } else {
          snapX = 0;
        }
      } else {
        snapX = 0;
      }
    }
    // Y Calculation
    if (snapY === null) {
      if (signY > 0) {
        if (resetLengthY > this.boardManager.board.settings.mass) {
          snapY =
            Math.abs(totalCountY) * totalSize +
            this.boardManager.board.settings.mass;
        } else if (resetLengthY < this.boardManager.board.settings.mass) {
          snapY = Math.abs(totalCountY) * totalSize;
        } else {
          snapY =
            Math.abs(totalCountY) * totalSize +
            this.boardManager.board.settings.mass;
        }
      } else if (signY < 0) {
        if (resetLengthY > this.boardManager.board.settings.void) {
          snapY = signY * (Math.abs(totalCountY) * totalSize + totalSize);
        } else {
          snapY =
            signY *
            (Math.abs(totalCountY) * totalSize +
              this.boardManager.board.settings.void);
        }
      } else {
        snapY = 0;
      }
    }
    return { canvasX: snapX, canvasY: snapY };
  }
  ///
  sizeSnapCalculation(
    canvasX: number,
    canvasY: number
  ): {
    width: number;
    height: number;
  } {
    let totalSize =
      this.boardManager.board.settings.mass +
      this.boardManager.board.settings.void;
    let CellWidth, CellHeight;
    if (canvasX % totalSize === 0 && canvasY % totalSize === 0) {
      return {
        width: this.boardManager.board.settings.mass,
        height: this.boardManager.board.settings.mass,
      };
    }
    // X
    let signX = canvasX / Math.abs(canvasX);
    let resetLengthX = Math.abs(canvasX % totalSize);
    // Y
    let signY = canvasY / Math.abs(canvasY);
    let resetLengthY = Math.abs(canvasY % totalSize);
    // X Calculation
    if (signX > 0) {
      if (resetLengthX >= this.boardManager.board.settings.mass) {
        CellWidth = this.boardManager.board.settings.void;
      } else {
        CellWidth = this.boardManager.board.settings.mass;
      }
    } else if (signX < 0) {
      if (resetLengthX >= this.boardManager.board.settings.void) {
        CellWidth = this.boardManager.board.settings.mass;
      } else {
        CellWidth = this.boardManager.board.settings.void;
      }
    } else {
      CellWidth = this.boardManager.board.settings.mass;
    }
    // Y Calculation
    if (signY > 0) {
      if (resetLengthY >= this.boardManager.board.settings.mass) {
        CellHeight = this.boardManager.board.settings.void;
      } else {
        CellHeight = this.boardManager.board.settings.mass;
      }
    } else if (signY < 0) {
      if (resetLengthY >= this.boardManager.board.settings.void) {
        CellHeight = this.boardManager.board.settings.mass;
      } else {
        CellHeight = this.boardManager.board.settings.void;
      }
    } else {
      CellHeight = this.boardManager.board.settings.mass;
    }
    return {
      width: CellWidth,
      height: CellHeight,
    };
  }
  ///
  async getRecInArea({
    start,
    end,
    fill,
    doForEveryCell,
  }: {
    start: paper.Point;
    end: paper.Point;
    fill: boolean;
    doForEveryCell: (point: paper.Point) => unknown;
  }) {
    ///
    let tempStart, tempEnd;
    let startX, startY, endX, endY;
    if (start.x < end.x) {
      startX = start.x;
      endX = end.x;
    } else {
      startX = end.x;
      endX = start.x;
    }
    if (start.y < end.y) {
      startY = start.y;
      endY = end.y;
    } else {
      startY = end.y;
      endY = start.y;
    }
    tempStart = new this.boardManager.boardPaperScope.Point(startX, startY);
    tempEnd = new this.boardManager.boardPaperScope.Point(endX, endY);

    let startBoardUnit = this.boardManager.kuficMath.getBoardUnitFromPoint({
      point: tempStart,
    });
    let endBoardUnit = this.boardManager.kuficMath.getBoardUnitFromPoint({
      point: tempEnd,
    });

    let { x: trackerX, y: trackerY } = startBoardUnit!;

    for (let unitX = trackerX; unitX <= endBoardUnit!.x; unitX++) {
      if (unitX === 0) {
        continue;
      }
      for (let unitY = trackerY; unitY <= endBoardUnit!.y; unitY++) {
        if (unitY === 0) {
          continue;
        }
        if (fill) {
          await doForEveryCell(new Point(unitX, unitY));
        } else {
          if (
            unitX === startBoardUnit!.x ||
            unitX === endBoardUnit!.x ||
            unitY === startBoardUnit!.y ||
            unitY === endBoardUnit!.y
          ) {
            await doForEveryCell(new Point(unitX, unitY));
          }
        }
      }
    }
  }
}
