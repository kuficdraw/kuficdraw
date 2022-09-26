import KuficBoardCanvas from "./kufic_board/ui_components/KuficBoardCanvas";
import React, { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import FloatingLogo from "./components/FloatingLogo";
import { Size } from "./kufic_board/types/size";
function App({ boardSize }: { boardSize: Size }) {
  let [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return isLoading ? (
    <>
      <SplashScreen />
    </>
  ) : (
    <>
      {/* <UI /> */}
      <FloatingLogo />
      <KuficBoardCanvas boardSize={boardSize} />
    </>
  );
  // return (
  //   <>
  //     <Canvas />
  //   </>
  //   // <>
  //   //   <UI>
  //   //     <Canvas />
  //   //   </UI>
  //   // </>
  // );
}

export default App;
