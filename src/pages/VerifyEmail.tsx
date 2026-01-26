import { useEffect, useState, useRef } from "react";
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
  const hasVerified = useRef(false); // Add ref to prevent double verification

  useEffect(() => {
    const token = searchParams.get("token");

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

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
      }
    };

    verify();

    // Cleanup function
    return () => {
      // Reset verification status if component unmounts during verification
      if (status === "loading") {
        console.log("Verification cancelled - component unmounted");
      }
    };
  }, [searchParams, navigate]); // Remove verifyEmail from dependencies

  const handleResendVerification = async () => {
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
  };

  const handleGoToLogin = () => {
    navigate("/auth");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

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
            <p className="text-muted-foreground">
              Redirecting to login page in a few seconds...
            </p>
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
