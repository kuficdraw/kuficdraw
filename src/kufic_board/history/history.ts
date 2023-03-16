import { Command } from "./command";

export class KuficHistory {
  private commands: Command[] = [];
  private currentCommandIndex: number = -1;

  addCommand(command: Command): void {
    // Remove any commands that were undone
    this.commands.splice(this.currentCommandIndex + 1);

    // Add the new command
    this.commands.push(command);
    this.currentCommandIndex++;
  }

  undo(): void {
    if (this.currentCommandIndex >= 0) {
      const command = this.commands[this.currentCommandIndex];
      command.undo();
      this.currentCommandIndex--;
    }
  }

  redo(): void {
    if (this.currentCommandIndex < this.commands.length - 1) {
      this.currentCommandIndex++;
      const command = this.commands[this.currentCommandIndex];
      command.execute();
    }
  }
}
