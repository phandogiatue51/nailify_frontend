export const getStatusConfig = (status: number, isShopOwner: boolean) => {
  const configs = {
    approve: {
      title: "Approve Booking?",
      description:
        "This will approve the customer's booking request. The customer will be notified.",
      confirmText: "Yes, approve this booking",
      variant: "success" as const,
    },
    reject: {
      title: "Reject Booking?",
      description:
        "This will reject the customer's booking request. The customer will be notified and this action cannot be undone.",
      confirmText: "Yes, reject this booking",
      variant: "destructive" as const,
    },
    cancel: {
      title: isShopOwner ? "Cancel Booking?" : "Cancel Your Booking?",
      description: isShopOwner
        ? "This will cancel the approved appointment. The customer will be notified and this action cannot be undone."
        : "This will cancel your booking request. Your time slot will be released and this action cannot be undone.",
      confirmText: "Yes, cancel this booking",
      variant: "destructive" as const,
    },
    complete: {
      title: "Mark as Completed?",
      description:
        "This will mark the booking as completed. The customer will be notified.",
      confirmText: "Yes, mark Complete this booking",
      variant: "success" as const,
    },
  };

  return configs;
};
