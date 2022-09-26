import { Point } from "paper/dist/paper-core";
import { Cell } from "../types/cell";
import { KuficBoardManager } from "../KuficBoardManager";

export class KuficKeyboard {
  boardManager: KuficBoardManager;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    +this.boardManager.boardPaperScope.view.on(
      "keydown",
      (event: paper.KeyEvent) => this.handleKeyEvents(event)
    );
    this.boardManager.boardPaperScope.view.on(
      "keyup",
      (event: paper.KeyEvent) => this.handleKeyUpEvents(event)
    );
  }
  handleKeyUpEvents(event: paper.KeyEvent) {
    this.boardManager.tempLayer.removeChildren();
  }
  handleKeyEvents(event: paper.KeyEvent) {
    // event.preventDefault();
    this.boardManager.tempLayer.removeChildren();

    /// Ctrl +
    if (Object(event).event.ctrlKey) {
      event.preventDefault();
      /// Ctrl + Shift + alt +
      if (
        Object(event).event.shiftKey &&
        Object(event).event.ctrlKey &&
        Object(event).event.altKey
      ) {
        switch (event.key) {
          case "s":
            this.boardManager.kuficFileManager.exportPNG();
            break;

          default:
            break;
        }
      }
      /// Ctrl + Shift +
      else if (Object(event).event.shiftKey) {
        switch (event.key) {
          case "s":
            this.boardManager.kuficFileManager.exportSVG();
            break;

          case "v":
            let textFromClip: string = "";
            navigator.clipboard.readText().then((_value) => {
              textFromClip = _value;
              try {
                let parsedText = JSON.parse(textFromClip);
                if (parsedText as Cell) {
                  let cellsFromClipboard: Cell[] = JSON.parse(textFromClip);
                  let offset = this.boardManager.kuficMath.getBoardUnitFromPoint(
                    { point: this.boardManager.currentMousePosition }
                  );
                  this.boardManager.darwCellsToBoard({
                    cells: cellsFromClipboard,
                    offset: offset!,
                    addTempLayer: true,
                  });
                }
              } catch (error) {}
            });
            break;

          default:
            break;
        }
      } else {
        ////
        switch (event.key) {
          ///////// Modes
          case "1":
            this.boardManager.kuficDrawTool.activate();
            this.boardManager.boardPaperScope.view.element.setAttribute(
              "data-cursor",
              "draw"
            );
            break;
          case "2":
            this.boardManager.kuficSelectTool.activate();
            this.boardManager.boardPaperScope.view.element.setAttribute(
              "data-cursor",
              "select"
            );
            break;
          case "3":
            this.boardManager.kuficMoveTool.activate();
            this.boardManager.boardPaperScope.view.element.setAttribute(
              "data-cursor",
              "move"
            );
            break;
          case "4":
            this.boardManager.kuficRulerTool.activate();
            this.boardManager.boardPaperScope.view.element.setAttribute(
              "data-cursor",
              "ruler"
            );
            break;
          //////// Zoom
          case "0":
            this.boardManager.fitToScreen();
            break;
          case "+":
            let newZoomPlus =
              this.boardManager.boardPaperScope.view.zoom * 1.05;
            this.boardManager.boardPaperScope.view.zoom = newZoomPlus;
            this.boardManager.updateBoard();
            break;
          case "-":
            let newZoomMinus =
              this.boardManager.boardPaperScope.view.zoom * 0.95;
            this.boardManager.boardPaperScope.view.zoom = newZoomMinus;
            this.boardManager.updateBoard();
            break;

          ////////
          case "s":
            this.boardManager.kuficFileManager.exportBoard();
            break;
          case "o":
            this.boardManager.kuficFileManager.importBoard();
            break;

          case "c":
            let copyCells: Cell[] = [];
            this.boardManager.cellsLayer
              .getItems({ selected: true })
              .forEach((_item) => copyCells.push(_item.data));
            let text2Copy: string = JSON.stringify(copyCells);
            navigator.clipboard.writeText(text2Copy);
            break;
          case "x":
            let cutCells: Cell[] = [];
            this.boardManager.cellsLayer
              .getItems({ selected: true })
              .forEach((_item) => {
                cutCells.push(_item.data);
                _item.remove();
              });
            let text2Cut: string = JSON.stringify(cutCells);
            navigator.clipboard.writeText(text2Cut);
            break;
          case "v":
            let textFromClip: string = "";
            navigator.clipboard.readText().then((_value) => {
              textFromClip = _value;
              try {
                let parsedText = JSON.parse(textFromClip);
                if (parsedText as Cell) {
                  let cellsFromClipboard: Cell[] = JSON.parse(textFromClip);
                  let offset = this.boardManager.kuficMath.getBoardUnitFromPoint(
                    { point: this.boardManager.currentMousePosition }
                  );
                  this.boardManager.darwCellsToBoard({
                    cells: cellsFromClipboard,
                    offset: offset!,
                    addTempLayer: false,
                  });
                }
              } catch (error) {}
            });
            break;

          default:
            break;
        }
      }
    } else {
      switch (event.key) {
        ///
        case "g":
          this.boardManager.toggleBoardGridVisibilty();
          break;
        case "d":
          this.boardManager.toggleBoardGridDashed();
          break;
        ///
        case "1":
          this.boardManager.board.settings.brushColor = "#330000";
          break;
        case "2":
          this.boardManager.board.settings.brushColor = "#FA9600";
          break;

        default:
          break;
      }
    }
  }
}
