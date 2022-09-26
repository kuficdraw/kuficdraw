import React, { useEffect, useState } from "react";
import { DialogMaker } from "../dialog/DialogMaker";
import MsgDialog from "../dialog/dialogs/Msg";
import KuficBoardCanvas from "../kufic_board/ui_components/KuficBoardCanvas";
import FloatingLogo from "./FloatingLogo";
import Styles from "./StartScreen.module.css";
function StartScreen() {
  let [voidLength, setVoidLength] = useState(30);
  let [massLength, setMassLength] = useState(90);
  let [create, setCreate] = useState(false);
  function changeVoid(value: number) {}
  function changeMass(value: number) {}
  useEffect(() => {
    document.getElementById("mass")!.addEventListener("input", function(evt) {
      setMassLength(
        +(document.getElementById("mass")! as HTMLInputElement).value
      );
    });
    document.getElementById("void")!.addEventListener("input", function(evt) {
      setVoidLength(
        +(document.getElementById("void")! as HTMLInputElement).value
      );
    });
  }, []);

  function createBoard() {
    if (voidLength > 0 && massLength > 0) {
      setCreate(true);
    } else {
      DialogMaker.showMsg(
        "تنبيه",
        `لابد أن تكون كتلة التكوين وفراغه أكبر من الصفر`
      );
    }
  }
  return (
    <>
      {create ? (
        <>
          <FloatingLogo />
          <KuficBoardCanvas
            boardSize={{ mass: massLength, void: voidLength }}
          />
        </>
      ) : (
        <>
          <div className={Styles.startScreen}>
            <div className={Styles.card}>
              <img className={Styles.logo} src="./kufic.png"></img>
              <form>
                <label htmlFor="mass">الكتلـــة:</label>
                <div className={Styles.field}>
                  <input
                    id="mass"
                    value={massLength}
                    type={"number"}
                    onChange={() => {}}
                    autoFocus
                  ></input>
                </div>
                <label htmlFor="void">الفـــراغ:</label>
                <div className={Styles.field}>
                  <input
                    id="void"
                    value={voidLength}
                    type={"number"}
                    onChange={() => {}}
                  ></input>
                </div>
                <div className={Styles.btn} onClick={() => createBoard()}>
                  <div>أَنْشِئْ تكوينًا</div>
                </div>
              </form>
              <div className={Styles.credits}>
                <div>
                  <div>Developed By</div>
                  <a href="https://twitter.com/7Eltantawy" target="_blank">
                    @Hassan Eltantawy
                  </a>
                </div>
                <div>
                  <div>Artwork By</div>
                  <a href="https://twitter.com/ahmedelbablyy" target="_blank">
                    @Ahmed Elbably
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default StartScreen;
