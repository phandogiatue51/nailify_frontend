import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("💥 React Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 40,
            backgroundColor: "#ff6b6b",
            color: "white",
            minHeight: "100vh",
            fontFamily: "sans-serif",
          }}
        >
          <h1>⚠️ Something went wrong</h1>
          <pre
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: 20,
              borderRadius: 10,
              overflow: "auto",
            }}
          >
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "white",
              color: "#ff6b6b",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
