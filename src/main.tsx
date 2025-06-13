import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { UI } from "./components/ui";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <>
    <UI />
    <App />
  </>
);
