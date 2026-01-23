// @/hooks/useEmail.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { emailAPI } from "@/services/api";
import { useToast } from "./use-toast";
import { useEffect } from "react"; // Add this import

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

// Main hook
export const useEmail = () => {
  const { toast } = useToast();

  // Send verification email mutation
  const sendVerificationEmail = useMutation({
    mutationFn: async (email: string) => {
      return await emailAPI.sendVerification(email);
    },
    onSuccess: () => {
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Error sending verification email:", error);
      toast({
        title: "Verification email sent",
        description:
          "If an account exists with this email, you'll receive a verification link.",
        duration: 5000,
      });
    },
  });

  // Verify email token
  const verifyEmail = useMutation({
    mutationFn: async (token: string) => {
      return await emailAPI.verify(token);
    },
    onSuccess: () => {
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Error verifying email:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid or expired verification link.",
        duration: 5000,
      });
    },
  });

  // Send password reset email mutation
  const sendPasswordResetEmail = useMutation({
    mutationFn: async (email: string) => {
      return await emailAPI.sendPasswordReset(email);
    },
    onSuccess: () => {
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Error sending password reset email:", error);
      toast({
        title: "Password reset email sent",
        description:
          "If an account exists with this email, you'll receive a password reset link.",
        duration: 5000,
      });
    },
  });

  // Reset password mutation
  const resetPassword = useMutation({
    mutationFn: async ({ token, newPassword }: ResetPasswordRequest) => {
      return await emailAPI.resetPassword({ token, newPassword });
    },
    onSuccess: () => {
      toast({
        title: "Password reset!",
        description: "Your password has been successfully reset.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "Invalid or expired reset link.",
        duration: 5000,
      });
    },
  });

  // Check reset token validity query - FIXED VERSION
  const useCheckResetToken = (token: string | null) => {
    const query = useQuery({
      queryKey: ["reset-token-validity", token],
      queryFn: async () => {
        if (!token) throw new Error("No token provided");
        return await emailAPI.checkResetToken(token);
      },
      enabled: !!token,
      retry: false,
    });

    // Handle success/error with useEffect
    useEffect(() => {
      if (query.isError) {
        console.error("Error checking reset token:", query.error);
        toast({
          variant: "destructive",
          title: "Invalid reset link",
          description: "This password reset link has expired or is invalid.",
          duration: 5000,
        });
      }
    }, [query.isError, query.error, toast]);

    return query;
  };

  return {
    sendVerificationEmail,
    sendPasswordResetEmail,
    verifyEmail,
    resetPassword,
    useCheckResetToken,
    isLoading:
      sendVerificationEmail.isPending ||
      sendPasswordResetEmail.isPending ||
      verifyEmail.isPending ||
      resetPassword.isPending,
  };
};

// Convenience hook for password reset flow
export const usePasswordReset = (token?: string | null) => {
  const { resetPassword, useCheckResetToken } = useEmail();

  const { data: tokenValid, isLoading: checkingToken } = useCheckResetToken(
    token || null,
  );

  const handleResetPassword = async (newPassword: string) => {
    if (!token) {
      throw new Error("No reset token provided");
    }

    await resetPassword.mutateAsync({
      token,
      newPassword,
    });
  };

  return {
    handleResetPassword,
    resetPassword,
    tokenValid: tokenValid ?? false,
    checkingToken,
  };
};
