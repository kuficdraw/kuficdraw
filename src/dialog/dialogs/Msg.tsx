import React, { useState } from "react";
import Styles from "./Msg.module.css";
import BodyStyles from "./Body.module.css";

function MsgDialog({ title, text }: { title: string; text: String }) {
  let [show, setShow] = useState(true);

  if (!show) {
    return <></>;
  }
  return (
    <>
      <div className={BodyStyles.body}>
        <div className={BodyStyles.card}>
          <div className={Styles.msg}>
            <div>{title}</div>
            <div></div>
            <div>{text}</div>
            <div
              onClick={() => {
                setShow(false);
              }}
            >
              إغلاق
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MsgDialog;
