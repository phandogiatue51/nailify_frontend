import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEmail } from "@/hooks/useEmail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, sendVerificationEmail } = useEmail();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [isResending, setIsResending] = useState(false);

  // Use refs to track verification state
  const hasVerified = useRef(false);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);
  const tokenRef = useRef<string | null>(null);

  // Extract token once and store in ref
  useEffect(() => {
    tokenRef.current = searchParams.get("token");
  }, [searchParams]);

  // Main verification effect - runs once
  useEffect(() => {
    const token = tokenRef.current;

    if (!token) {
      setStatus("error");
      return;
    }

    // Prevent multiple verifications
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verify = async () => {
      try {
        await verifyEmail.mutateAsync(token);
        setStatus("success");

        // Set up auto-redirect
        redirectTimer.current = setTimeout(() => {
          navigate("/auth");
        }, 5000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
      }
    };

    verify();

    // Cleanup function
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, [navigate, verifyEmail]); // Only depend on navigate and verifyEmail

  // Memoized handlers
  const handleResendVerification = useCallback(async () => {
    const userEmail = prompt("Please enter your email to resend verification:");
    if (!userEmail) return;

    setIsResending(true);
    try {
      await sendVerificationEmail.mutateAsync(userEmail);
      alert(
        `Verification email sent to ${userEmail}. Please check your inbox.`,
      );
    } catch (error) {
      console.error("Failed to resend verification:", error);
      alert("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [sendVerificationEmail]);

  const handleGoToLogin = useCallback(() => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
    }
    navigate("/auth");
  }, [navigate]);

  const handleGoToHome = useCallback(() => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
    }
    navigate("/");
  }, [navigate]);

  const handleManualRedirect = useCallback(() => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
    }
    navigate("/auth");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-12 w-12 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email."}
            {status === "success" &&
              "Your email has been successfully verified."}
            {status === "error" &&
              "The verification link is invalid or has expired."}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {status === "success" && (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Redirecting to login page in 5 seconds...
              </p>
              <Button
                onClick={handleManualRedirect}
                variant="link"
                className="text-sm"
              >
                Click here to redirect now
              </Button>
            </div>
          )}

          {status === "error" && (
            <p className="text-muted-foreground">
              This verification link may have expired or is invalid.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {status === "success" && (
            <>
              <Button onClick={handleGoToLogin} className="w-full">
                Go to Login
              </Button>
              <Button
                onClick={handleGoToHome}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>

              <Button
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
