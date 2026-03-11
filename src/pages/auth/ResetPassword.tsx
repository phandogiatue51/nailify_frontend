// @/pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePasswordReset } from "@/hooks/useEmail";
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
import { Loader2, CheckCircle, XCircle, Lock, Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { handleResetPassword, tokenValid, checkingToken } =
    usePasswordReset(token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if token is valid on mount
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. No token found.");
    }
  }, [token]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate token
    if (!tokenValid && !checkingToken) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await handleResetPassword(newPassword);
      setIsSuccess(true);

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (error: any) {
      console.error("Failed to reset password:", error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate("/forgot-password");
  };

  const handleGoToLogin = () => {
    navigate("/auth");
  };

  // Show loading while checking token
  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if token invalid
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link has expired or is invalid.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Password reset links are valid for 30 minutes. Please request a
              new one.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleRequestNewLink} className="w-full">
              Request New Reset Link
            </Button>
            <Button
              onClick={handleGoToLogin}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Password Reset!</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Redirecting to login page in a few seconds...
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleGoToLogin} className="w-full">
              Go to Login Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-blue-500" />
          </div>

          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and
                number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold text-sm mb-2">
                Password Requirements
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li
                  className={`flex items-center gap-2 ${newPassword.length >= 8 ? "text-green-600" : ""}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>At least 8 characters</span>
                </li>
                <li
                  className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? "text-green-600" : ""}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>One uppercase letter (A-Z)</span>
                </li>
                <li
                  className={`flex items-center gap-2 ${/[a-z]/.test(newPassword) ? "text-green-600" : ""}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${/[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>One lowercase letter (a-z)</span>
                </li>
                <li
                  className={`flex items-center gap-2 ${/\d/.test(newPassword) ? "text-green-600" : ""}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${/\d/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>One number (0-9)</span>
                </li>
              </ul>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !newPassword || !confirmPassword}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <Button
            onClick={handleRequestNewLink}
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
          >
            Request New Reset Link
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
