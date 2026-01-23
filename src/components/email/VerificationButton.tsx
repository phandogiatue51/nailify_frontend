// @/components/email/VerificationButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useEmail } from "@/hooks/useEmail";
import { Loader2 } from "lucide-react";

interface VerificationButtonProps {
  email: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary";
}

export const VerificationButton: React.FC<VerificationButtonProps> = ({
  email,
  className = "",
  size = "default",
  variant = "outline",
}) => {
  const { sendVerificationEmail, isLoading } = useEmail();

  const handleClick = async () => {
    if (!email.trim()) return;

    try {
      await sendVerificationEmail.mutateAsync(email);
    } catch (error) {
      console.error("Failed to send verification:", error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || !email.trim()}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        "Verify Email"
      )}
    </Button>
  );
};
