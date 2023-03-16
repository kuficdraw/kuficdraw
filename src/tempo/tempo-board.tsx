import * as React from "react";
import * as paper from "paper";

export class InfiniteGrid extends React.Component {
  private paperScope: paper.PaperScope;

  constructor(props: {}) {
    super(props);

    this.paperScope = new paper.PaperScope();
    this.paperScope.setup("canvas");

    const { view } = this.paperScope;
    view.viewSize = new paper.Size(10000, 10000);

    this.drawGrid();
  }

  private drawGrid() {
    const { project } = this.paperScope;

    const numRows = 1000;
    const numCols = 1000;
    const massHeight = 100;
    const voidHeight = 50;

    for (let row = 0; row < numRows; row++) {
      const height = row % 2 === 0 ? massHeight : voidHeight;

      for (let col = 0; col < numCols; col++) {
        const width = col % 2 === 0 ? massHeight : voidHeight;

        const rect = new paper.Rectangle(
          col * massHeight,
          row * voidHeight,
          width,
          height
        );
        const fillColor = row % 2 === col % 2 ? "red" : "gray";
        const path = new paper.Path.Rectangle(rect);
        path.fillColor = new paper.Color(fillColor);
        project.activeLayer.addChild(path);
      }
    }
  }

  render() {
    return <canvas id="canvas" />;
  }
}
