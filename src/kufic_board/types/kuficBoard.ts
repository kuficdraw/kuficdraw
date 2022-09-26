import { Attachment } from "./attachment";
import { Cell } from "./cell";

export interface KuficBoard {
  version: number;
  settings: KuficBoardSettings;
  cells: Cell[];
  attachments: Attachment[];
}
export interface KuficBoardSettings {
  mass: number;
  void: number;
  color: string;
  brushColor: string;
  gridColor: string;
  showGrid: boolean;
  dashGrid: boolean;
}
