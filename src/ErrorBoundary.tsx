import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  children?: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
  resetOnRouteChange?: boolean; // Reset when route changes
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("💥 React Error Boundary caught:", error, errorInfo);
    this.setState({ errorInfo });

    // Log to error reporting service (optional)
    // logErrorToService(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error when route changes (if enabled)
    if (this.props.resetOnRouteChange && this.state.hasError) {
      const prevPath = window.location.pathname;
      // You might need a more sophisticated route comparison
      if (prevProps.children !== this.props.children) {
        this.resetError();
      }
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-md w-full space-y-6">
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">
                Oops! Something went wrong
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-4">
                <p className="text-sm">
                  We encountered an unexpected error. Please try refreshing the
                  page.
                </p>

                {this.state.error && (
                  <div className="bg-destructive/10 p-3 rounded-md">
                    <p className="text-xs font-mono text-destructive">
                      {this.state.error.message || this.state.error.toString()}
                    </p>
                  </div>
                )}

                {/* Show development details */}
                {process.env.NODE_ENV === "development" &&
                  this.state.errorInfo && (
                    <details className="text-xs border rounded p-3 cursor-pointer">
                      <summary className="font-medium">
                        Developer Details
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-60 bg-black/5 p-2 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={this.resetError}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>

                  <Button
                    onClick={() => window.location.reload()}
                    variant="default"
                    className="flex-1"
                  >
                    Reload Page
                  </Button>

                  <Link to="/" className="flex-1">
                    <Button variant="ghost" className="w-full gap-2">
                      <Home className="h-4 w-4" />
                      Go Home
                    </Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>

            {/* Quick debugging tips for development */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-muted p-4 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">💡 Debugging Tips:</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Check if API data is properly loaded</li>
                  <li>Verify props aren't undefined before accessing</li>
                  <li>Use optional chaining (?. ) for nested properties</li>
                  <li>Add loading/error states to async components</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
