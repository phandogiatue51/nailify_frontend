import { Calendar } from "lucide-react";

interface DateDisplayProps {
  dateString: string;
  label?: string;
  showTime?: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({
  dateString,
  label,
  showTime = false,
}) => {
  const date = new Date(dateString);

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
      <Calendar className="w-3 h-3" />
      <span>
        {label ? `${label}: ` : ""}
        {formattedDate}
        {showTime && ` ${formattedTime}`}
      </span>
    </div>
  );
};

export default DateDisplay;
