import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import "./index.css";

try {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("❌ No element with id 'root' found!");
  }

  const root = createRoot(rootElement);

  root.render(
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>,
  );
} catch (error) {
  document.body.innerHTML = `
    <div style="color: red; padding: 20px; font-family: sans-serif;">
      <h1>App Failed to Load</h1>
      <pre>${error}</pre>
      <p>Check browser console for details.</p>
    </div>
  `;
}
