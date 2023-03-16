import KuficBoardCanvas from "./kufic_board/ui_components/KuficBoardCanvas";
import React, { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import FloatingLogo from "./components/FloatingLogo";
import { Size } from "./kufic_board/types/size";

interface Props {
  boardSize: Size;
}

const App: React.FC<Props> = ({ boardSize }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timerId);
  }, []);

  return isLoading ? (
    <SplashScreen />
  ) : (
    <>
      <FloatingLogo />
      <KuficBoardCanvas boardSize={boardSize} />
    </>
  );
};

export default App;
