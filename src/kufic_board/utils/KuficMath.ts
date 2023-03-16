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
    const boardMass = this.boardManager.board.settings.mass;
    const boardVoid = this.boardManager.board.settings.void;
    let total = boardMass + boardVoid;
    let x, y;
    let cordXSign = cordX / Math.abs(cordX);
    let cordYSign = cordY / Math.abs(cordY);
    ///
    if (cordXSign > 0) {
      if (cordX % 2 === 0) {
        x = Math.trunc(cordX / 2) * total - boardVoid;
      } else {
        x = Math.trunc(cordX / 2) * total;
      }
    } else {
      if (cordX % 2 === 0) {
        x = Math.trunc(cordX / 2) * total;
      } else {
        x = Math.trunc(cordX / 2) * total - boardVoid;
      }
    }
    ///
    if (cordYSign > 0) {
      if (cordY % 2 === 0) {
        y = Math.trunc(cordY / 2) * total - boardVoid;
      } else {
        y = Math.trunc(cordY / 2) * total;
      }
    } else {
      if (cordY % 2 === 0) {
        y = Math.trunc(cordY / 2) * total;
      } else {
        y = Math.trunc(cordY / 2) * total - boardVoid;
      }
    }
    return new Point(x, y);
  }
  ///
  getBoardUnitFromPoint({ point }: { point: paper.Point }): paper.Point | null {
    const boardMass = this.boardManager.board.settings.mass;
    const boardVoid = this.boardManager.board.settings.void;
    if (point) {
      let total = boardMass + boardVoid;
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
    const boardMass = this.boardManager.board.settings.mass;
    const boardVoid = this.boardManager.board.settings.void;
    let totalSize = boardMass + boardVoid;
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
        if (resetLengthX > boardMass) {
          snapX = Math.abs(totalCountX) * totalSize + boardMass;
        } else if (resetLengthX < boardMass) {
          snapX = Math.abs(totalCountX) * totalSize;
        } else {
          snapX = Math.abs(totalCountX) * totalSize + boardMass;
        }
      } else if (signX < 0) {
        if (resetLengthX > boardVoid) {
          snapX = signX * (Math.abs(totalCountX) * totalSize + totalSize);
        } else if (resetLengthX < boardVoid) {
          snapX = signX * (Math.abs(totalCountX) * totalSize + boardVoid);
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
        if (resetLengthY > boardMass) {
          snapY = Math.abs(totalCountY) * totalSize + boardMass;
        } else if (resetLengthY < boardMass) {
          snapY = Math.abs(totalCountY) * totalSize;
        } else {
          snapY = Math.abs(totalCountY) * totalSize + boardMass;
        }
      } else if (signY < 0) {
        if (resetLengthY > boardVoid) {
          snapY = signY * (Math.abs(totalCountY) * totalSize + totalSize);
        } else {
          snapY = signY * (Math.abs(totalCountY) * totalSize + boardVoid);
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
    const boardMass = this.boardManager.board.settings.mass;
    const boardVoid = this.boardManager.board.settings.void;
    let totalSize = boardMass + boardVoid;
    let CellWidth, CellHeight;
    if (canvasX % totalSize === 0 && canvasY % totalSize === 0) {
      return {
        width: boardMass,
        height: boardMass,
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
      if (resetLengthX >= boardMass) {
        CellWidth = boardVoid;
      } else {
        CellWidth = boardMass;
      }
    } else if (signX < 0) {
      if (resetLengthX >= boardVoid) {
        CellWidth = boardMass;
      } else {
        CellWidth = boardVoid;
      }
    } else {
      CellWidth = boardMass;
    }
    // Y Calculation
    if (signY > 0) {
      if (resetLengthY >= boardMass) {
        CellHeight = boardVoid;
      } else {
        CellHeight = boardMass;
      }
    } else if (signY < 0) {
      if (resetLengthY >= boardVoid) {
        CellHeight = boardMass;
      } else {
        CellHeight = boardVoid;
      }
    } else {
      CellHeight = boardMass;
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
