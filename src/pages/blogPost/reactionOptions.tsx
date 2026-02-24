import { FaAngry, FaSadTear, FaSurprise, FaLaughSquint } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { FcLike } from "react-icons/fc";

export const reactionOptions = [
  {
    type: 0,
    icon: <BiSolidLike size={24} className="text-blue-600" />,
    label: "Like",
  },
  { type: 1, icon: <FcLike size={24} />, label: "Love" },
  {
    type: 2,
    icon: <FaLaughSquint size={24} className="text-orange-600" />,
    label: "Haha",
  },
  {
    type: 3,
    icon: <FaSurprise size={24} className="text-amber-600" />,
    label: "Wow",
  },
  {
    type: 4,
    icon: <FaSadTear size={24} className="text-slate-600" />,
    label: "Sad",
  },
  {
    type: 5,
    icon: <FaAngry size={24} className="text-red-600" />,
    label: "Angry",
  },
];

export const getReactionTextColor = (type: number) => {
  switch (type) {
    case 0:
      return "text-blue-600"; // Like
    case 1:
      return "text-pink-600"; // Love (or use pink for FcLike)
    case 2:
      return "text-orange-600"; // Haha
    case 3:
      return "text-amber-600"; // Wow
    case 4:
      return "text-slate-600"; // Sad
    case 5:
      return "text-red-600"; // Angry
    default:
      return "text-gray-500";
  }
};
