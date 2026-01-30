import { MapPin, Phone, Clock, Trash2, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export const LocationsTab = ({ locations, isLoading, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Button
        onClick={() => navigate("/my-shop/locations/create")}
        variant="outline"
        className="w-full h-12 rounded-2xl border-dashed border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Add Branch Location
      </Button>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-300" />
        </div>
      ) : (
        locations?.map((loc) => (
          <div
            key={loc.shopLocationId}
            className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex justify-between items-center group"
          >
            <div className="space-y-2">
              <h3 className="font-black text-slate-800 leading-tight">
                {loc.address}
              </h3>
              <div className="flex flex-col gap-1">
                <span className="flex items-center text-[11px] font-bold text-slate-400 uppercase">
                  <Clock className="w-3 h-3 mr-1 text-[#FFC988]" />
                  {loc.openingTime} - {loc.closingTime}
                </span>
                <span className="flex items-center text-[11px] font-bold text-slate-400 uppercase">
                  <Phone className="w-3 h-3 mr-1 text-[#E288F9]" />
                  {loc.phone || "No phone listed"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  navigate(`/my-shop/locations/edit/${loc.shopLocationId}`)
                }
                className="rounded-full bg-slate-50 text-slate-400 hover:text-slate-900"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(loc.shopLocationId)}
                className="rounded-full bg-red-50 text-red-300 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
