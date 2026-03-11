// @/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmail } from "@/hooks/useEmail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendPasswordResetEmail, isLoading } = useEmail();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await sendPasswordResetEmail.mutateAsync(email);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Failed to send reset email:", error);
      // Error is already handled in the hook, but we can set a local error too
      setError("Something went wrong. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToLogin}
            className="self-start -ml-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Button>

          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-blue-500" />
          </div>

          <CardTitle className="text-2xl text-center">
            {isSubmitted ? "Check Your Email" : "Forgot Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? `We sent a password reset link to ${email}`
              : "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Enter the email address associated with your account and we'll
                  send you a link to reset your password.
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <Mail className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">
                  Password reset email sent!
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Please check your inbox at{" "}
                  <span className="font-medium">{email}</span> for the password
                  reset link.
                </p>

                <div className="rounded-lg bg-muted p-4 text-left">
                  <h4 className="font-semibold text-sm mb-2">
                    Didn't receive the email?
                  </h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure you entered the correct email address</li>
                    <li>• Wait a few minutes and try again</li>
                    <li>• The link expires in 30 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {!isSubmitted ? (
            <>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !email.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link to="/auth" className="text-primary hover:underline">
                  Log in here
                </Link>
              </p>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                  setError("");
                }}
                variant="outline"
                className="w-full"
              >
                Use a Different Email
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Resend Reset Link"
                )}
              </Button>
              <Button
                onClick={handleBackToLogin}
                variant="ghost"
                className="w-full"
              >
                Back to Login
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
