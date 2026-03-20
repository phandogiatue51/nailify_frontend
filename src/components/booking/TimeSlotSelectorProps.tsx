import { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TimeSlotSelectorProps {
    timeSlots: string[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    bookings?: any[];
    isShopOwner?: boolean;
    canCompleteBeforeClose?: (slot: string) => boolean;
    isSlotBusy?: (slot: string, bookings: any[]) => boolean;
    isSlotInPast?: (slot: string) => boolean;
}

export const TimeSlotSelector = ({
    timeSlots,
    selectedTime,
    onSelectTime,
    bookings = [],
    isShopOwner = false,
    canCompleteBeforeClose = () => true,
    isSlotBusy = () => false,
    isSlotInPast = () => false,
}: TimeSlotSelectorProps) => {
    const [activeTab, setActiveTab] = useState("morning");

    const timeGroups = useMemo(() => {
        return {
            morning: timeSlots.filter(slot => parseInt(slot.split(":")[0]) < 11),
            afternoon: timeSlots.filter(slot => parseInt(slot.split(":")[0]) >= 11 && parseInt(slot.split(":")[0]) < 14),
            evening: timeSlots.filter(slot => parseInt(slot.split(":")[0]) >= 14 && parseInt(slot.split(":")[0]) < 18),
            night: timeSlots.filter(slot => parseInt(slot.split(":")[0]) >= 18),
        };
    }, [timeSlots]);

    const renderTimeButtons = (slots: string[]) => {
        return slots.map((slot) => {
            const busy = isSlotBusy(slot, bookings);
            const inPast = isSlotInPast(slot);
            const canComplete = canCompleteBeforeClose(slot);
            const isSelected = selectedTime === slot;

            const disabled = (busy || inPast || !canComplete) && !isShopOwner;

            return (
                <button
                    key={slot}
                    disabled={disabled}
                    onClick={() => onSelectTime(slot)}
                    className={cn(
                        "relative py-4 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center",
                        isSelected
                            ? "bg-gradient-to-r from-[#950101] to-[#ffcfe9] text-white scale-95 shadow-md"
                            : busy
                                ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                                : inPast
                                    ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                                    : !canComplete
                                        ? "bg-slate-50 border-transparent text-slate-200 cursor-not-allowed"
                                        : "bg-white border-slate-100 border text-slate-600 hover:border-slate-200 hover:shadow-sm",
                    )}
                >
                    {slot}
                    {busy && (
                        <span className="text-[8px] uppercase absolute bottom-1">
                            Bận
                        </span>
                    )}
                    {!canComplete && (
                        <span className="text-[10px] absolute bottom-1">(đóng cửa)</span>
                    )}
                    {inPast && (
                        <span className="text-[10px] absolute bottom-1">(đã qua)</span>
                    )}
                </button>
            );
        });
    };

    const tabs = [
        { id: "morning", label: "Sáng", slots: timeGroups.morning },
        { id: "afternoon", label: "Trưa", slots: timeGroups.afternoon },
        { id: "evening", label: "Chiều", slots: timeGroups.evening },
        { id: "night", label: "Tối", slots: timeGroups.night },
    ].filter(tab => tab.slots.length > 0);

    if (tabs.length === 0) {
        return (
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Clock className="w-5 h-5 text-[#950101]" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-tight">
                            Chọn thời gian
                        </h2>
                    </div>
                    <div className="text-center py-8 text-slate-400">
                        Không có khung giờ khả dụng
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Clock className="w-5 h-5 text-[#950101]" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-tight">
                            Chọn thời gian
                        </h2>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100 p-1 rounded-2xl">
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#950101] data-[state=active]:shadow-sm text-xs font-bold"
                            >
                                {tab.label} ({tab.slots.length})
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map(tab => (
                        <TabsContent key={tab.id} value={tab.id} className="mt-0">
                            <div className="grid grid-cols-4 gap-2">
                                {renderTimeButtons(tab.slots)}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};