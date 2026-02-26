import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const versionedSwUrl = `${import.meta.env.BASE_URL}sw.js?v=${encodeURIComponent(__APP_VERSION__)}`;
    navigator.serviceWorker.register(versionedSwUrl).catch(() => {
      // Ignore registration failure to avoid blocking app rendering.
    });
  });
}
