// @/hooks/useEmail.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { emailAPI } from "@/services/api";
import { useToast } from "./use-toast";
import { useEffect, useMemo } from "react";

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

interface EmailResponse {
  message: string;
  success: boolean;
}

export const useEmail = () => {
  const { toast } = useToast();

  // Send verification email mutation
  const sendVerificationEmail = useMutation({
    mutationFn: async (email: string): Promise<EmailResponse> => {
      const response = await emailAPI.sendVerification(email);
      return response;
    },
    onSuccess: (data: EmailResponse) => {
      toast({
        description: data.message || "Verification email sent successfully!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error sending verification email:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification email";
      toast({
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Verify email token
  const verifyEmail = useMutation({
    mutationFn: async (token: string): Promise<EmailResponse> => {
      return await emailAPI.verify(token);
    },
    onSuccess: (data: EmailResponse) => {
      toast({
        description: data.message || "Email verified successfully!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error verifying email:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to verify email";
      toast({
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Send password reset email mutation
  const sendPasswordResetEmail = useMutation({
    mutationFn: async (email: string): Promise<EmailResponse> => {
      return await emailAPI.sendPasswordReset(email);
    },
    onSuccess: (data: EmailResponse) => {
      toast({
        description: data.message || "Password reset email sent!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error sending password reset email:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to send password reset email";
      toast({
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Reset password mutation
  const resetPassword = useMutation({
    mutationFn: async ({ token, newPassword }: ResetPasswordRequest): Promise<EmailResponse> => {
      return await emailAPI.resetPassword({ token, newPassword });
    },
    onSuccess: (data: EmailResponse) => {
      toast({
        description: data.message || "Password reset successfully!",
        variant: "success",
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error("Error resetting password:", error);
      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "Failed to reset password";
      toast({
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Check reset token validity query
  const useCheckResetToken = (token: string | null) => {
    const query = useQuery({
      queryKey: ["reset-token-validity", token],
      queryFn: async (): Promise<{ valid: boolean; message?: string }> => {
        if (!token) throw new Error("No token provided");
        return await emailAPI.checkResetToken(token);
      },
      enabled: !!token,
      retry: false,
    });

    // Handle error with useEffect
    useEffect(() => {
      if (query.isError) {
        console.error("Error checking reset token:", query.error);
        const errorMessage = (query.error as any)?.response?.data?.message ||
          (query.error as any)?.message ||
          "Invalid or expired reset token";
        toast({
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }
    }, [query.isError, query.error, toast]);

    return query;
  };

  return useMemo(
    () => ({
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
    }),
    [sendVerificationEmail, sendPasswordResetEmail, verifyEmail, resetPassword],
  );
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
    tokenValid: tokenValid?.valid ?? false,
    checkingToken,
  };
};