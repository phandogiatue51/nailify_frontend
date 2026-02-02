import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("❌ No element with id 'root' found!");

  registerSW({
    onNeedRefresh() {
      console.log("New content available, please refresh.");
    },
    onOfflineReady() {
      console.log("App ready to work offline.");
    },
  });

  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
} catch (error) {
  document.body.innerHTML = `
    <div style="color: red; padding: 20px; font-family: sans-serif;">
      <h1>App Failed to Load</h1>
      <pre>${error}</pre>
      <p>Check browser console for details.</p>
    </div>
  `;
}
