import { KuficBoard } from "../types/kuficBoard";
import { Command } from "./command";

export class SetCellsCommand implements Command {
  private previousKuficBoard: KuficBoard;

  constructor(private oldBoard: KuficBoard, private newBoard: KuficBoard) {
    this.previousKuficBoard = oldBoard;
  }

  execute(): void {
    this.oldBoard = this.newBoard;
  }

  undo(): void {
    this.oldBoard = this.previousKuficBoard;
  }
}
