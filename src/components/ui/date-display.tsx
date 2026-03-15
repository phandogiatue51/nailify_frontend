import { Calendar } from "lucide-react";

interface DateDisplayProps {
  dateString?: string | null;
  label?: string;
  showTime?: boolean;
  fallbackText?: string;
  isIcon?: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({
  dateString,
  label,
  showTime = false,
  fallbackText = "Không có thông tin ngày",
  isIcon = true,
}) => {
  if (!dateString) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500/70 italic">
        {isIcon && <Calendar className="w-3 h-3" />}
        <span>
          {label ? `${label}: ` : ""}
          {fallbackText}
        </span>
      </div>
    );
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return <span>Ngày không hợp lệ</span>;
  }

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isIcon && <Calendar className="w-3 h-3" />}
      <span>
        {label ? `${label}: ` : ""}
        {formattedDate}
        {showTime && ` ${formattedTime}`}
      </span>
    </div>
  );
};

export default DateDisplay;
