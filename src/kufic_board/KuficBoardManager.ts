import { BoardMode } from "./enums/boardMode";
import { Cell } from "./types/cell";
import { KuficNavigation } from "./utils/KuficNavigation";
import { KuficMath } from "./utils/KuficMath";
import { KuficTouch } from "./utils/KuficTouch";
import { KuficSettingsGUI } from "./utils/KuficSettingsGUI";
import { KuficFileManager } from "./utils/KuficFileManager";
import { Point, Layer, Color } from "paper/dist/paper-core";
import { KuficBoard } from "./types/kuficBoard";
import { BoardUnit } from "./types/position";
import { KuficSelctTool } from "./tools/KuficSelectTool";
import { KuficDrawTool } from "./tools/KuficDrawTool";
import { KuficMoveTool } from "./tools/KuficMoveTool";
import { Attachment } from "./types/attachment";
import { KuficImageElement } from "./elements/KuficImageElement";
import { KuficRulerTool } from "./tools/KuficRulerTool";

export class KuficBoardManager {
  board: KuficBoard;
  //////////
  boardMode: BoardMode;
  overrideWhenDrawing: boolean;
  paintExisitingOnly: boolean;
  currentMousePosition: paper.Point;
  ////////// Layers
  cellsLayer: paper.Layer;
  GridLayer: paper.Layer;
  tempLayer: paper.Layer;
  attachmentLayer: paper.Layer;
  ////////// Tools
  kuficSelectTool: paper.Tool;
  kuficDrawTool: paper.Tool;
  kuficMoveTool: paper.Tool;
  kuficRulerTool: paper.Tool;
  ////////// Helpers
  kuficMath: KuficMath;
  kuficNavigation: KuficNavigation;
  kuficTouch: KuficTouch;
  kuficFileManager: KuficFileManager;
  boardPaperScope: paper.PaperScope;

  constructor({
    scope,
    board,
  }: {
    scope: paper.PaperScope;
    board: KuficBoard;
  }) {
    this.board = board;
    this.boardPaperScope = scope;
    /////////
    this.boardMode = BoardMode.draw;
    this.overrideWhenDrawing = false;
    this.paintExisitingOnly = false;
    ////////// Layers
    this.attachmentLayer = new Layer({ name: "AttachmentLayer" });
    this.GridLayer = new Layer({ name: "GridLayer" });
    this.cellsLayer = new Layer({ name: "CellsLayer" });
    this.tempLayer = new Layer({ name: "TempLayer" });
    ////////// Tools
    this.kuficSelectTool = new this.boardPaperScope.Tool();
    new KuficSelctTool(this);
    this.kuficDrawTool = new this.boardPaperScope.Tool();
    new KuficDrawTool(this);
    this.kuficMoveTool = new this.boardPaperScope.Tool();
    new KuficMoveTool(this);
    this.kuficRulerTool = new this.boardPaperScope.Tool();
    new KuficRulerTool(this);
    this.kuficDrawTool.activate();
    ////////// Helpers
    this.kuficMath = new KuficMath(this);
    this.kuficNavigation = new KuficNavigation(this);
    this.kuficTouch = new KuficTouch(this);
    this.kuficFileManager = new KuficFileManager(this);
    //////////
    this.currentMousePosition = new Point(0, 0);
    this.boardPaperScope.view.on("mousemove", (event: paper.MouseEvent) =>
      this.handleMouseMove(event)
    );
    //////////
    this.setZeroCordToScreenCenter();
    this.boardPaperScope.view.onResize = () => this.onResize();
    this.boardInit();
  }
  handleMouseMove(event: paper.MouseEvent) {
    this.currentMousePosition = event.point;
  }

  async boardInit() {
    await this.clearBoard();
    this.updateBoard();
    await this.generateBoardCells();
    await this.generateBoardAttachments();
    this.setBoardBackground();
    this.setCursorToCurrentMode();
    this.fitToScreen();
  }

  setZeroCordToScreenCenter() {
    this.boardPaperScope.view.center = this.boardPaperScope.view.center.add(
      new Point(
        -this.boardPaperScope.view.bounds.width / 2,
        -this.boardPaperScope.view.bounds.height / 2
      )
    );
  }

  async clearBoard() {
    for (
      let index = 0;
      index < this.boardPaperScope.project.layers.length;
      index++
    ) {
      await this.boardPaperScope.project.layers[index].removeChildren();
    }
  }

  setBoardBackground() {
    this.boardPaperScope.view.element.style.backgroundColor = this.board.settings.color;
  }

  onResize() {
    this.darwBoardGridLines();
  }

  async clearGridLines() {
    this.GridLayer.removeChildren();
  }
  async darwBoardGridLines() {
    // Remove All
    await this.clearGridLines();
    if (this.board.settings.showGrid) {
      this.GridLayer.activate();
      let tolerance = this.board.settings.mass * 4;
      let zeroCordColor = new this.boardPaperScope.Color("red");
      // get  this.boardPaper  Bound
      let {
        x: paperX,
        y: paperY,
        width: paperWidth,
        height: paperHeight,
      } = this.boardPaperScope.view.bounds;

      let x = paperX - tolerance;
      let y = paperY - tolerance;
      while (x <= paperX + paperWidth + this.board.settings.mass * 4) {
        let { width: sizeX } = this.kuficMath.sizeSnapCalculation(x, paperY);
        let { canvasX: tempX } = this.kuficMath.positionSnapCalculation(
          x,
          paperY
        );
        var path = new this.boardPaperScope.Path();
        if (tempX === 0) {
          path.strokeColor = zeroCordColor;
          if (this.board.settings.dashGrid) {
            path.dashArray = [40, 10];
          }
        } else {
          if (this.board.settings.dashGrid) {
            path.dashArray = [10, 10];
          }
          path.strokeColor = new this.boardPaperScope.Color(
            this.board.settings.gridColor
          );
        }
        path.add(new Point(tempX, paperY));
        path.add(new Point(tempX, paperY + paperHeight));
        // this.boardLines.push(path);
        x += sizeX;
      }
      while (y <= paperY + paperHeight + this.board.settings.mass * 4) {
        let { height: sizeY } = this.kuficMath.sizeSnapCalculation(paperX, y);
        let { canvasY: tempY } = this.kuficMath.positionSnapCalculation(
          paperX,
          y
        );
        var path = new this.boardPaperScope.Path();
        if (tempY === 0) {
          if (this.board.settings.dashGrid) {
            path.dashArray = [40, 10];
          }
          path.strokeColor = zeroCordColor;
        } else {
          if (this.board.settings.dashGrid) {
            path.dashArray = [10, 10];
          }
          path.strokeColor = new this.boardPaperScope.Color(
            this.board.settings.gridColor
          );
        }
        path.add(new Point(paperX, tempY));
        path.add(new Point(paperX + paperWidth, tempY));
        // this.boardLines.push(path);
        y += sizeY;
      }
    }
    // this.gridLineLayer.sendToBack();
  }

  toggleBoardGridVisibilty() {
    this.board.settings.showGrid = !this.board.settings.showGrid;
    this.darwBoardGridLines();
  }

  toggleBoardGridDashed() {
    this.board.settings.dashGrid = !this.board.settings.dashGrid;
    this.darwBoardGridLines();
  }

  async generateBoardCells() {
    // for (let index = 0; index < this.board.cells.length; index++) {
    //   const element = this.board.cells[index];

    // }
    this.darwCellsToBoard({
      cells: this.board.cells,
      addTempLayer: false,
    });
  }

  async generateBoardAttachments() {
    for (let index = 0; index < this.board.attachments.length; index++) {
      const element = this.board.attachments[index];
      let raster = await new KuficImageElement({
        attach: element,
        boardManager: this,
      });
    }
  }

  darwCellsToBoard({
    cells,
    offset,
    addTempLayer,
  }: {
    cells: Cell[];
    offset?: BoardUnit;
    addTempLayer: boolean;
  }) {
    if (cells.length > 0) {
      ///
      let translateBy: paper.Point;
      if (offset) {
        let topLeftCell: Cell = cells[0];
        cells.forEach((_cell) => {
          if (_cell.pos.x < topLeftCell.pos.x) {
            topLeftCell.pos.x = _cell.pos.x;
          }
          if (_cell.pos.y < topLeftCell.pos.y) {
            topLeftCell.pos.y = _cell.pos.y;
          }
        });
        translateBy = new Point(
          -topLeftCell.pos.x + offset!.x,
          -topLeftCell.pos.y + offset!.y
        );
      }
      cells.forEach((cell: Cell) => {
        if (cell) {
          if (offset) {
            /// Add Offset
            if (cell.pos.x < 0 && translateBy.x + cell.pos.x >= 0) {
              cell.pos.x += translateBy.x + 1;
            } else if (cell.pos.x > 0 && translateBy.x + cell.pos.x <= 0) {
              cell.pos.x += translateBy.x - 1;
            } else {
              cell.pos.x += translateBy.x;
            }
            if (cell.pos.y < 0 && translateBy.y + cell.pos.y >= 0) {
              cell.pos.y += translateBy.y + 1;
            } else if (cell.pos.y > 0 && translateBy.y + cell.pos.y <= 0) {
              cell.pos.y += translateBy.y - 1;
            } else {
              cell.pos.y += translateBy.y;
            }
            if (offset.x < 0) {
              cell.pos.x += 1;
              if (cell.pos.x === 0) {
                cell.pos.x += 1;
              }
            }

            if (offset.y < 0) {
              cell.pos.y += 1;
              if (cell.pos.y === 0) {
                cell.pos.y += 1;
              }
            }
          }

          /// Draw
          if (addTempLayer) {
            this.drawToTemp(cell);
          } else {
            this.drawRecByBoardUnit(cell);
          }
        }
      });
    }
  }

  drawToTemp(cell: Cell) {
    this.tempLayer.activate();
    let point = this.kuficMath.getPointFromBoardUnit({
      cordX: cell.pos.x,
      cordY: cell.pos.y,
    });

    let { width, height } = this.kuficMath.sizeSnapCalculation(
      point.x + this.board.settings.void / 10,
      point.y + this.board.settings.void / 10
    );

    let rectangle = new this.boardPaperScope.Rectangle(
      point.x,
      point.y,
      width,
      height
    );

    let path = new this.boardPaperScope.Path.Rectangle(rectangle);
    path.fillColor = new this.boardPaperScope.Color(cell.color);
    path.selected = false;
    path.closed = true;
  }

  drawRecByCanvasPosition(point: paper.Point): paper.Path | null {
    let unit = this.kuficMath.getBoardUnitFromPoint({
      point: point,
    });
    if (unit) {
      let { x, y } = unit;

      return this.drawRecByBoardUnit({
        color: this.board.settings.brushColor,
        pos: { x: x, y: y },
      });
    } else {
      return null;
    }
  }

  drawRecByBoardUnit(cell: Cell): paper.Path | null {
    let foundRec = false;
    let point = this.kuficMath.getPointFromBoardUnit({
      cordX: cell.pos.x,
      cordY: cell.pos.y,
    });
    let hit = this.cellsLayer.hitTest(
      new Point(
        point.x + this.board.settings.void / 10,
        point.y + this.board.settings.void / 10
      )
    );

    if (hit) {
      foundRec = true;
    }

    if (this.overrideWhenDrawing || this.paintExisitingOnly) {
      if (this.paintExisitingOnly) {
        if (!hit) {
          return null;
        }
      }
      foundRec = false;
      if (hit) {
        this.removeAtPoint(
          new Point(
            point.x + this.board.settings.void / 10,
            point.y + this.board.settings.void / 10
          )
        );
      }
    }

    if (!foundRec) {
      this.cellsLayer.activate();
      let { width, height } = this.kuficMath.sizeSnapCalculation(
        point.x + this.board.settings.void / 10,
        point.y + this.board.settings.void / 10
      );

      let rectangle = new this.boardPaperScope.Rectangle(
        point.x,
        point.y,
        width,
        height
      );
      let path = new this.boardPaperScope.Path.Rectangle(rectangle);

      path.fillColor = new this.boardPaperScope.Color(cell.color);
      path.selected = false;
      path.closed = true;
      path.data = cell;
      return path;
    }
    return null;
  }

  removeAtPoint(point: paper.Point) {
    if (point) {
      let hit = this.cellsLayer.hitTest(new Point(point.x, point.y));
      if (hit) {
        hit.item.remove();
      }
    }
  }

  async prepareBoardToExport() {
    await this.PrepareCellToExport();
    await this.PrepareAttachmentToExport();
  }

  async PrepareCellToExport() {
    this.board.cells = [];
    // this.cellsLayer.children.forEach((_cell) => {
    //   this.board.cells.push(_cell.data);
    // });
    for (let index = 0; index < this.cellsLayer.children.length; index++) {
      await this.board.cells.push(this.cellsLayer.children[index].data);
    }
  }
  async PrepareAttachmentToExport() {
    this.board.attachments = [];

    for (let index = 0; index < this.attachmentLayer.children.length; index++) {
      let raster = this.attachmentLayer.children[index] as paper.Raster;
      let image = raster.image as MediaImage;

      let attach: Attachment = {
        x: raster.position.x,
        y: raster.position.y,
        scaling: { x: raster.scaling.x, y: raster.scaling.y },
        rotatation: raster.rotation,
        base64: image.src,
      };

      await this.board.attachments.push(attach);
    }
  }

  setCursor(mode: string) {
    this.boardPaperScope.view.element.setAttribute("data-cursor", mode);
  }

  setCursorToCurrentMode() {
    switch (this.boardPaperScope.tool) {
      case this.kuficSelectTool:
        this.setCursor("select");
        break;
      case this.kuficMoveTool:
        this.setCursor("move");
        break;
      case this.kuficDrawTool:
        this.setCursor("draw");
        break;
      case this.kuficRulerTool:
        this.setCursor("ruler");
        break;

      default:
        break;
    }
  }

  drawRefenceToMouseCursor(showCell: boolean, showAxis: boolean) {
    this.drawRefenceToPoint(this.currentMousePosition, showCell, showAxis);
  }

  drawRefenceToPoint(
    cursorPos: paper.Point,
    showCell: boolean,
    showAxis: boolean
  ) {
    if (!(this.boardPaperScope.tool === this.kuficDrawTool)) {
      return;
    }
    this.tempLayer.removeChildren();
    this.tempLayer.activate();
    if (showCell) {
      this.drawHoverdCellDrawing(cursorPos);
    }
    if (showAxis) {
      this.drawAxisDrawing(cursorPos);
    }
  }

  drawAxisDrawing(cursorPos: paper.Point) {
    let { width, height } = this.kuficMath.sizeSnapCalculation(
      cursorPos.x,
      cursorPos.y
    );
    /////////
    let { canvasX: x, canvasY: y } = this.kuficMath.positionSnapCalculation(
      cursorPos.x,
      cursorPos.y
    );
    /////////////////////////
    let colorAlpha = new Color(this.board.settings.brushColor);
    colorAlpha.alpha = 0.1;
    /////////
    let rectangleX = new this.boardPaperScope.Rectangle(
      this.boardPaperScope.view.bounds.left,
      y,
      this.boardPaperScope.view.bounds.width,
      height
    );
    let pathX = new this.boardPaperScope.Path.Rectangle(rectangleX);

    pathX.fillColor = colorAlpha;
    pathX.selected = false;
    pathX.closed = true;
    ///////// Y
    let rectangleY = new this.boardPaperScope.Rectangle(
      x,
      this.boardPaperScope.view.bounds.top,
      width,
      this.boardPaperScope.view.bounds.height
    );
    let pathY = new this.boardPaperScope.Path.Rectangle(rectangleY);

    pathY.fillColor = colorAlpha;
    pathY.selected = false;
    pathY.closed = true;
  }

  drawHoverdCellDrawing(cursorPos: paper.Point) {
    /////////
    let { width, height } = this.kuficMath.sizeSnapCalculation(
      cursorPos.x,
      cursorPos.y
    );
    /////////
    let { canvasX: x, canvasY: y } = this.kuficMath.positionSnapCalculation(
      cursorPos.x,
      cursorPos.y
    );

    let rectangle = new this.boardPaperScope.Rectangle(x, y, width, height);
    let path = new this.boardPaperScope.Path.Rectangle(rectangle);

    path.fillColor = new Color(this.board.settings.brushColor);
    path.selected = false;
    path.closed = true;
  }
  fitToScreen() {
    let elementBound = this.cellsLayer.bounds;
    this.boardPaperScope.view.center = elementBound.center;
    this.updateBoard();
  }

  updateBoard() {
    this.darwBoardGridLines();
  }
}
