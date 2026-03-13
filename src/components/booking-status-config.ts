export const getStatusConfig = (status: number, isShopOwner: boolean) => {
  const configs = {
    approve: {
      title: "Xác nhận lịch hẹn?",
      description:
        "Hành động này sẽ xác nhận lịch đặt của khách hàng. Hệ thống sẽ gửi thông báo cho khách.",
      confirmText: "Xác nhận lịch hẹn",
      variant: "success" as const,
    },
    reject: {
      title: "Từ chối lịch hẹn?",
      description:
        "Lịch đặt này sẽ bị từ chối và không thể hoàn tác. Khách hàng sẽ nhận được thông báo.",
      confirmText: "Từ chối lịch này",
      variant: "destructive" as const,
    },
    cancel: {
      title: isShopOwner ? "Hủy lịch hẹn này?" : "Hủy lịch hẹn của bạn?",
      description: isShopOwner
        ? "Lịch hẹn đã xác nhận sẽ bị hủy. Khách hàng sẽ được thông báo và không thể hoàn tác."
        : "Yêu cầu đặt lịch của bạn sẽ bị hủy. Khung giờ này sẽ được mở lại cho người khác.",
      confirmText: "Xác nhận hủy lịch",
      variant: "destructive" as const,
    },
    complete: {
      title: "Hoàn thành dịch vụ?",
      description:
        "Đánh dấu lịch hẹn này là đã hoàn thành. Khách hàng sẽ nhận được thông báo kết thúc.",
      confirmText: "Xác nhận hoàn thành",
      variant: "success" as const,
    },
  };

  return configs;
};
