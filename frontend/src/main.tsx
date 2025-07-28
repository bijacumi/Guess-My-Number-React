//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GameProvider } from "./context/GameContext";
import { TutorialProvider } from "./context/TutorialContext";

createRoot(document.getElementById("root")!).render(
  <GameProvider>
    <TutorialProvider>
      <App />
    </TutorialProvider>
  </GameProvider>
);
