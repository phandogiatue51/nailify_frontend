import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ← ADD THIS IMPORT
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import "./index.css";

console.log("🔍 main.tsx is loading...");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element:", rootElement);

  if (!rootElement) {
    throw new Error("❌ No element with id 'root' found!");
  }

  console.log("🎯 Creating React root...");
  const root = createRoot(rootElement);

  console.log("🚀 Rendering App component...");
  root.render(
    <BrowserRouter>
      {" "}
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>,
  );

  console.log("✅ App rendered successfully!");
} catch (error) {
  console.error("💥 Fatal error in main.tsx:", error);
  document.body.innerHTML = `
    <div style="color: red; padding: 20px; font-family: sans-serif;">
      <h1>App Failed to Load</h1>
      <pre>${error}</pre>
      <p>Check browser console for details.</p>
    </div>
  `;
}
