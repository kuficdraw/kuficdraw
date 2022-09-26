import { KuficBoardManager } from "../KuficBoardManager";
import * as dat from "dat.gui";
import { Size } from "../types/size";
import { boradToShow } from "../demo_board/demo";
import { DialogMaker } from "../../dialog/DialogMaker";
export class KuficSettingsGUI {
  boardManager: KuficBoardManager;
  boardControllerGUI: dat.GUI;
  fileFolder: dat.GUI;
  ImportFolder: dat.GUI;
  ExportFolder: dat.GUI;
  ExportSelectionFolder: dat.GUI;
  boardSizeFolder: dat.GUI;
  colorFolder: dat.GUI;
  SettingsFolder: dat.GUI;
  HazardFolder: dat.GUI;
  boardSizeMass: number;
  boardSizeVoid: number;
  constructor(boardManager: KuficBoardManager) {
    this.boardManager = boardManager;
    this.boardControllerGUI = new dat.GUI();
    this.boardSizeMass = this.boardManager.board.settings.mass;
    this.boardSizeVoid = this.boardManager.board.settings.void;
    ///
    this.fileFolder = this.boardControllerGUI.addFolder("File");
    this.ImportFolder = this.fileFolder.addFolder("Import");
    this.ExportFolder = this.fileFolder.addFolder("Export");
    this.ExportSelectionFolder = this.fileFolder.addFolder("Export Selection");
    ///
    this.boardSizeFolder = this.boardControllerGUI.addFolder("Board Size");
    this.colorFolder = this.boardControllerGUI.addFolder("Coloring");
    this.SettingsFolder = this.boardControllerGUI.addFolder("Settings");
    this.HazardFolder = this.boardControllerGUI.addFolder("Hazard!");
    // this.drawBoardControllerGUI();
    // this.drawBoardExportGUI();
    this.drawAll();
  }

  //////////////////////////
  drawAll() {
    this.drawFileFolder();
    this.drawBoardSizeFolder();
    this.drawColorFolder();
    this.drawSettingsFolder();
    this.drawHazardFolder();
  }
  //////////////////////////
  drawFileFolder() {
    this.drawImportFolder();
    this.drawExportFolder();
    this.drawExportSelectionFolder();
  }
  drawImportFolder() {
    let options = {
      "Import Board": () => {
        this.boardManager.kuficFileManager.importBoard();
      },
      "Import Image": () => {
        this.boardManager.kuficFileManager.importImage();
      },
    };
    this.ImportFolder.add(options, "Import Board");
    this.ImportFolder.add(options, "Import Image");
  }
  drawExportFolder() {
    let options = {
      "Export Board": () => {
        this.boardManager.kuficFileManager.exportBoard();
      },
      "Image DPI": this.boardManager.kuficFileManager.imageRasterResolution,

      "Export PNG": () => {
        this.boardManager.kuficFileManager.exportPNG();
      },
      "Export SVG": () => {
        this.boardManager.kuficFileManager.exportSVG();
      },
    };
    this.ExportFolder.add(options, "Export Board");
    this.ExportFolder.add(options, "Image DPI", 72, 300).onChange((value) => {
      this.boardManager.kuficFileManager.imageRasterResolution = value;
    });
    this.ExportFolder.add(options, "Export PNG");
    this.ExportFolder.add(options, "Export SVG");
  }
  drawExportSelectionFolder() {
    let options = {
      "Image DPI": this.boardManager.kuficFileManager.imageRasterResolution,
      "Export PNG": () => {
        this.boardManager.kuficFileManager.exportSelectedAsPNG();
      },
      "Export SVG": () => {
        this.boardManager.kuficFileManager.exportSelectedAsSVG();
      },
    };
    this.ExportSelectionFolder.add(options, "Image DPI", 72, 300).onChange(
      (value) => {
        this.boardManager.kuficFileManager.imageRasterResolution = value;
      }
    );
    this.ExportSelectionFolder.add(options, "Export PNG");
    this.ExportSelectionFolder.add(options, "Export SVG");
  }
  //////////////////////////
  drawBoardSizeFolder() {
    let options = {
      Mass: this.boardSizeMass,
      Void: this.boardSizeVoid,
      "Regenerate Board": async () => {
        if (this.boardSizeMass > 0 && this.boardSizeVoid > 0) {
          await this.boardManager.prepareBoardToExport();
          this.boardManager.board.settings.mass = this.boardSizeMass;
          this.boardManager.board.settings.void = this.boardSizeVoid;
          await this.boardManager.boardInit();
        } else {
          DialogMaker.showMsg(
            "تنبيه",
            `لابد أن تكون كتلة التكوين وفراغه أكبر من الصفر`
          );
        }
      },
    };
    this.boardSizeFolder.add(options, "Mass").onChange((value) => {
      this.boardSizeMass = value;
    });
    this.boardSizeFolder.add(options, "Void").onChange((value) => {
      this.boardSizeVoid = value;
    });
    this.boardSizeFolder.add(options, "Regenerate Board");
  }
  //////////////////////////
  drawColorFolder() {
    let options = {
      Brush: this.boardManager.board.settings.brushColor,
      "Grid Color": this.boardManager.board.settings.gridColor,
      "Board Color": this.boardManager.board.settings.color,
    };
    this.colorFolder.addColor(options, "Brush").onChange((value) => {
      this.boardManager.board.settings.brushColor = value;
    });
    this.colorFolder.addColor(options, "Grid Color").onChange((value) => {
      this.boardManager.board.settings.gridColor = value;
      this.boardManager.darwBoardGridLines();
    });
    this.colorFolder.addColor(options, "Board Color").onChange((value) => {
      this.boardManager.board.settings.color = value;
      this.boardManager.setBoardBackground();
    });
  }
  //////////////////////////
  drawSettingsFolder() {
    let options = {
      "Override Drawing": this.boardManager.overrideWhenDrawing,
      "Paint only": this.boardManager.paintExisitingOnly,
      "Show Grid": this.boardManager.board.settings.showGrid,
      "Dash Grid": this.boardManager.board.settings.dashGrid,
    };
    this.SettingsFolder.add(options, "Override Drawing").onChange((value) => {
      this.boardManager.overrideWhenDrawing = value;
    });
    this.SettingsFolder.add(options, "Paint only").onChange((value) => {
      this.boardManager.paintExisitingOnly = value;
    });
    this.SettingsFolder.add(options, "Show Grid").onChange((value) => {
      this.boardManager.toggleBoardGridVisibilty();
    });
    this.SettingsFolder.add(options, "Dash Grid").onChange((value) => {
      this.boardManager.toggleBoardGridDashed();
    });
  }
  //////////////////////////
  drawHazardFolder() {
    let options = {
      "Clear Screen": async () => {
        this.boardManager.board = boradToShow;
        await this.boardManager.boardInit();
      },
    };
    this.HazardFolder.add(options, "Clear Screen");
  }
}
