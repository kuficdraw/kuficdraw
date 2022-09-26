import React, { useEffect } from "react";
import { KuficBoardManager } from "../KuficBoardManager";
import Styles from "./Toolbar.module.css";
function Toolbar({ boardManager }: { boardManager: KuficBoardManager }) {
  useEffect(() => {
    console.log("BoardChange");
  }, [boardManager]);

  function activeDraw() {
    boardManager.kuficDrawTool.activate();
  }
  function activeSelect() {
    boardManager.kuficSelectTool.activate();
  }
  function activeMove() {
    boardManager.kuficDrawTool.activate();
  }
  return (
    <div className={Styles.toolbar}>
      <div
        className={
          boardManager.boardPaperScope.tool === boardManager.kuficDrawTool
            ? Styles.active
            : ""
        }
        onClick={activeDraw}
      >
        <p>D</p>
      </div>
      <div
        className={
          boardManager.boardPaperScope.tool === boardManager.kuficSelectTool
            ? Styles.active
            : ""
        }
        onClick={activeSelect}
      >
        S
      </div>
      <div
        className={
          boardManager.boardPaperScope.tool === boardManager.kuficMoveTool
            ? Styles.active
            : ""
        }
        onClick={boardManager.kuficMoveTool.activate}
      >
        M
      </div>
    </div>
  );
}

export default Toolbar;
