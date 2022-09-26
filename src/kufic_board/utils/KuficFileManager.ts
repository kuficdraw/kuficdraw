import { Point } from "paper/dist/paper-core";
import { DialogMaker } from "../../dialog/DialogMaker";
import { KuficImageElement } from "../elements/KuficImageElement";
import { KuficBoardManager } from "../KuficBoardManager";
import { Attachment } from "../types/attachment";
import { KuficBoard } from "../types/kuficBoard";
export class KuficFileManager {
  boardManager: KuficBoardManager;
  imageRasterResolution: number;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.imageRasterResolution = 150;
  }

  async exportSVG() {
    if (!(this.boardManager.cellsLayer.getItems({}).length > 0)) {
      DialogMaker.showMsg("تنبيه", `لا يوجد ما يتم إخراجه بعد`);
      return;
    }
    let selctedGroup: paper.Group = new this.boardManager.boardPaperScope.Group();

    /// Add Selceted to group
    this.boardManager.cellsLayer.getItems({}).forEach((_item) => {
      _item.copyTo(selctedGroup);
    });
    ///Remove Data from items
    selctedGroup.getItems({}).forEach((_cell) => {
      _cell.data = null;
    });
    ///Edit SVG string
    let svgData = await selctedGroup.exportSVG({ asString: true });
    svgData = svgData
      .toString()
      .replaceAll("&lt;", "<")
      .replaceAll(`&quot;`, `"`)
      .replaceAll("&gt;", ">")
      .replaceAll(`<g xmlns`, `<svg xmlns`)
      .replaceAll(`</g>`, `</svg>`);
    ///
    this.download({
      content: svgData,
      fileName: "art.svg",
      contentType: "text/plain",
    });
    selctedGroup.removeChildren();
  }

  async exportPNG() {
    if (!(this.boardManager.cellsLayer.getItems({}).length > 0)) {
      DialogMaker.showMsg("تنبيه", `لا يوجد ما يتم إخراجه بعد`);
      return;
    }
    this.boardManager.setCursor("loading");

    try {
      let raster = this.boardManager.cellsLayer.rasterize({
        resolution: this.imageRasterResolution,
      });

      await raster.canvas.toBlob(
        async function(blob) {
          try {
            var a = document.createElement("a");

            a.href = await URL.createObjectURL(blob!);
            a.download = "art.png";
            a.click();
          } catch (error) {
            DialogMaker.showMsg(
              "تنبيه",
              `يبدو أنك تحاول إخراج صورة بحجم كبير جدا حاول تقليل الـDPI أو قم بتحديد الجزء الذي تريد إخراجه فقط`
            );
          }
        },
        "image/png",
        1
      );
    } catch (error) {
      DialogMaker.showMsg(
        "تنبيه",
        `يبدو أنك تحاول إخراج صورة بحجم كبير جدا حاول تقليل الـDPI أو قم بتحديد الجزء الذي تريد إخراجه فقط`
      );
    }
    this.boardManager.setCursorToCurrentMode();
  }
  async exportSelectedAsSVG() {
    if (
      !(this.boardManager.cellsLayer.getItems({ selected: true }).length > 0)
    ) {
      DialogMaker.showMsg("تنبيه", `برجاء قم بتحديد الجزء الذي تريد إخراجه`);

      return;
    }
    let selctedGroup: paper.Group = new this.boardManager.boardPaperScope.Group();

    /// Add Selceted to group
    this.boardManager.cellsLayer
      .getItems({ selected: true })
      .forEach((_item) => {
        _item.copyTo(selctedGroup);
      });
    ///Remove Data from items
    selctedGroup.getItems({}).forEach((_cell) => {
      _cell.data = null;
    });
    ///Edit SVG string
    let svgData = await selctedGroup.exportSVG({ asString: true });
    svgData = svgData
      .toString()
      .replaceAll("&lt;", "<")
      .replaceAll(`&quot;`, `"`)
      .replaceAll("&gt;", ">")
      .replaceAll(`<g xmlns`, `<svg xmlns`)
      .replaceAll(`</g>`, `</svg>`);
    ///
    this.download({
      content: svgData,
      fileName: "art.svg",
      contentType: "text/plain",
    });

    this.boardManager.updateBoard();
  }

  async exportSelectedAsPNG() {
    if (
      !(this.boardManager.cellsLayer.getItems({ selected: true }).length > 0)
    ) {
      DialogMaker.showMsg("تنبيه", `برجاء قم بتحديد الجزء الذي تريد إخراجه`);
      return;
    }
    this.boardManager.setCursor("loading");
    let selctedGroup: paper.Group = new this.boardManager.boardPaperScope.Group();

    this.boardManager.cellsLayer
      .getItems({ selected: true })
      .forEach((_item) => {
        // selctedGroup.copyTo
        _item.copyTo(selctedGroup);
      });

    let raster = selctedGroup.rasterize({
      resolution: this.imageRasterResolution,
    });
    await raster.canvas.toBlob(
      async function(blob) {
        try {
          var a = document.createElement("a");

          a.href = await URL.createObjectURL(blob!);
          a.download = "art.png";
          a.click();
        } catch (error) {
          DialogMaker.showMsg(
            "تنبيه",
            `يبدو أنك تحاول إخراج صورة بحجم كبير جدا حاول تقليل الـDPI أو قم بتحديد جزء أصغر لإخراجه إن لم يفلح الأمر حاول استخدام Export Selected SVG`
          );
        }
      },
      "image/png",
      1
    );
    selctedGroup.removeChildren();
    this.boardManager.setCursorToCurrentMode();
  }

  async exportBoard() {
    await this.boardManager.prepareBoardToExport();
    var jsonString = await JSON.stringify(this.boardManager.board);
    this.download({
      content: jsonString,
      fileName: "art.bably",
      contentType: "text/plain",
    });
  }

  importBoard() {
    let inputEle = document.createElement("input");
    inputEle.type = "file";
    inputEle.style.display = "none";
    inputEle.accept = ".bably";
    inputEle.addEventListener("change", (event: any) =>
      this.handleDialog(event)
    );
    inputEle.click();
  }
  importImage() {
    let inputEle = document.createElement("input");
    inputEle.type = "file";
    inputEle.style.display = "none";
    inputEle.accept = "image/*";
    inputEle.addEventListener("change", (event: any) => {
      this.handleImageDialog(event);
    });
    inputEle.click();
  }

  handleImageDialog(event: any) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        var dataURL = reader.result;
        let attach: Attachment = {
          base64: dataURL!.toString(),
          x: this.boardManager.boardPaperScope.view.center.x,
          y: this.boardManager.boardPaperScope.view.center.y,
          rotatation: 0,
          scaling: new Point(1, 1),
        };
        const image = new KuficImageElement({
          attach: attach,
          boardManager: this.boardManager,
        });
      } catch (error) {
        DialogMaker.showMsg("حدثت مشكلة", `حدثت مشكلة أثناء تنفيذ هذا الإجراء`);
      }
    };
    reader.readAsDataURL(input.files[0]);
  }

  handleDialog(event: any) {
    var file = event.target!.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        let board: KuficBoard | null;
        var contents = e.target!.result;
        // displayContents(contents);
        let parsed = JSON.parse(contents!.toString());
        if (parsed as KuficBoard) {
          board = JSON.parse(contents!.toString()) as KuficBoard;
          this.boardManager.board = board;
          this.boardManager.boardInit();
        }
      } catch (error) {
        DialogMaker.showMsg("حدثت مشكلة", `حدثت مشكلة أثناء تنفيذ هذا الإجراء`);
      }
    };
    reader.readAsText(file);
  }

  handleReading(e: ProgressEvent<FileReader>) {
    try {
      let board: KuficBoard | null;
      var contents = e.target!.result;
      // displayContents(contents);
      board = JSON.parse(contents!.toString()) as KuficBoard;
      this.boardManager.board = board;
      let a = this.boardManager.boardInit;
    } catch (error) {
      DialogMaker.showMsg("حدثت مشكلة", `حدثت مشكلة أثناء تنفيذ هذا الإجراء`);
    }
  }

  download({ content, fileName, contentType }: any) {
    try {
      var a = document.createElement("a");
      var file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    } catch (error) {
      DialogMaker.showMsg("حدثت مشكلة", `حدثت مشكلة أثناء تنفيذ هذا الإجراء`);
    }
  }
}
