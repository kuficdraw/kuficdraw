import React from "react";
import { Tabs } from "../libs/TabSystem";
import BoardProperties from "./BoardProperties";
import "./UI.css";
function UI({ children }: { children: any }) {
  return (
    <div className="ui">
      <div className="ribbon">
        <Tabs query={"ds"}>
          <div data-label="KUFIC" data-enLabel="kufic"></div>
          <div data-label="إعدادات اللوحة" data-enLabel="ar">
            <div>إعدادات اللوحة</div>
          </div>
          <div data-label="أشكال حروف الهجاء" data-enLabel="ar4">
            "أشكال حروف الهجاء"
          </div>
        </Tabs>
      </div>
      <img className="logo" src="./kufic.png"></img>
      {children}
      <div className="footer">
        <div>صنع بالـ ❤ في مصر</div>
      </div>
    </div>
  );
}

export default UI;
