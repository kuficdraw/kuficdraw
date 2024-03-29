import React, { useEffect, useState } from "react";
// import Paper from "paper";
import { PaperScope } from "paper/dist/paper-core";
import { KuficBoardManager } from "../KuficBoardManager";
import { boradToShow } from "../demo_board/demo";
import { KuficKeyboard } from "../utils/KuficKeyboard";
import { KuficSettingsGUI } from "../utils/KuficSettingsGUI";
import Toolbar from "./Toolbar";
import { Size } from "../types/size";
import { KuficBoard } from "../types/kuficBoard";

const KuficBoardCanvas = ({
  boardSize,
  kuficBoard,
}: {
  boardSize?: Size;
  kuficBoard?: KuficBoard;
}) => {
  let scope: paper.PaperScope;
  let [tool, setTool] = useState(<></>);

  window.onload = () => {
    scope.install(window);
  };

  const checkSize = () => {
    scope.view.viewSize.width = window.innerWidth;
    scope.view.viewSize.height = window.innerHeight;
  };

  const disableContextMenu = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  useEffect(() => {
    window.addEventListener("resize", checkSize);
    document
      .getElementById("kuficdarw")!
      .addEventListener("contextmenu", disableContextMenu);
    return () => {
      window.removeEventListener("resize", checkSize);
      document
        .getElementById("kuficdarw")!
        .removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  useEffect(() => {
    scope = new PaperScope();
    scope.setup("kuficdarw");
    checkSize();
    ///

    let boardTomake = boradToShow;

    if (boardSize !== undefined) {
      boardTomake.settings.mass = boardSize.mass;
      boardTomake.settings.void = boardSize.void;
    }

    if (kuficBoard !== undefined) {
      boardTomake = kuficBoard;
    }

    let board = new KuficBoardManager({
      scope: scope,
      board: boardTomake,
    });
    new KuficKeyboard(board);
    new KuficSettingsGUI(board);
    setTool(<Toolbar boardManager={board} />);
  }, []);

  return (
    <>
      {/* {tool} */}
      <canvas id="kuficdarw" />;
    </>
  );
};

export default KuficBoardCanvas;
