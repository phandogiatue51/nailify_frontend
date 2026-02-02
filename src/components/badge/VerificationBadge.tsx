import { CircleCheckBig, CircleAlert } from "lucide-react";

type VerificationBadgeProps = {
  label: string;
  verified: boolean;
};

export const VerificationBadge = ({ label, verified }: VerificationBadgeProps) => {
  return (
    <div className="mt-4 flex flex-col items-center">
      <div
        className={`flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full text-white 
          ${verified ? "bg-green-400" : "bg-yellow-400"}`}
      >
        <span className="text-xs font-bold uppercase tracking-wide">
          {verified ? `${label} Verified` : "Pending Verification"}
        </span>
        {verified ? (
          <CircleCheckBig className="w-3 h-3" />
        ) : (
          <CircleAlert className="w-3 h-3" />
        )}
      </div>
    </div>
  );
};
