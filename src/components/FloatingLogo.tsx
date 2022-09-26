import React from "react";
import Styles from "./FloatingLogo.module.css";
function FloatingLogo() {
  return (
    <div className={Styles.waterMark}>
      <img className={Styles.logo} src="./kufic.png"></img>
      <div className={Styles.text}>
        <div>KuficDraw</div>
        <div>| ALPHA</div>
      </div>
    </div>
  );
}

export default FloatingLogo;
