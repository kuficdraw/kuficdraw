import React from "react";
import Styles from "./SplashScreen.module.css";

function SplashScreen() {
  return (
    <div className={Styles.splash}>
      <div className={Styles.card}>
        <img className={Styles.logo} src="./kufic.png"></img>
      </div>
      <div className={Styles.credits}>
        <div>
          Developed by{" "}
          <a href="https://twitter.com/7Eltantawy" rel="external">
            Hassan Eltantawy{" "}
          </a>
        </div>
        <div>
          {" | "} Artwork by{" "}
          <a href="https://twitter.com/ahmedelbablyy" rel="external">
            @AhmedElbably
          </a>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
