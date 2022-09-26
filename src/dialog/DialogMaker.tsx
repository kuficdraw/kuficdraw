import React from "react";
import { Root, createRoot } from "react-dom/client";
import MsgDialog from "./dialogs/Msg";

export class DialogMaker {
  constructor() {}

  static showMsg(title: string, msg: string) {
    let popup: HTMLElement = document.getElementById("popup") as HTMLElement;
    popup.innerHTML = "";
    let root = createRoot(popup);
    const element = <MsgDialog title={title} text={msg} />;
    root.render(element);
  }
}
