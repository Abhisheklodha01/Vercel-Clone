import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import AppWraper from "./AppWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWraper />
    <Toaster />
  </StrictMode>
);
