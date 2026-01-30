// @/pages/RegisterSuccess.tsx
import { VerificationButton } from "@/components/email/VerificationButton";

const RegisterSuccess = () => {
  const email = localStorage.getItem("registeredEmail");

  return (
    <div>
      <h1>Registration Successful!</h1>
      <p>Check your email at {email} for verification</p>
      <VerificationButton email={email || ""} />
    </div>
  );
};
