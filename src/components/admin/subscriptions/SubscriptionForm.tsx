import React, { useState, useEffect } from "react";
import { Subscription } from "@/types/database";
import { subscriptionAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette } from "lucide-react";
import * as Icons from "react-icons/fa";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface SubscriptionFormProps {
  subscriptionId: string;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const SubscriptionForm = ({
  subscriptionId,
  onClose,
  onSuccess,
}: SubscriptionFormProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  // Load subscription data
  useEffect(() => {
    if (!subscriptionId) return;

    const loadSubscription = async () => {
      setLoading(true);
      try {
        const data = await subscriptionAPI.getById(subscriptionId);
        setSubscription(data);
        setFormData(data);
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [subscriptionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value ? Number(value) : null,
    }));
  };

  const handleCustomGradient = (color: string, position: "start" | "end") => {
    const colors = formData.colorHex?.match(
      /#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g,
    ) || ["#950101", "#FF6B6B"];

    const startColor = position === "start" ? color : colors[0];
    const endColor = position === "end" ? color : colors[1] || colors[0];

    setFormData({
      ...formData,
      colorHex: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();

      if (formData.name) formDataToSend.append("Name", formData.name);
      if (formData.description)
        formDataToSend.append("Description", formData.description);
      if (formData.price)
        formDataToSend.append("Price", formData.price.toString());
      if (formData.durationDays)
        formDataToSend.append("DurationDays", formData.durationDays.toString());
      if (formData.iconUrl) formDataToSend.append("IconUrl", formData.iconUrl);
      if (formData.colorHex)
        formDataToSend.append("ColorHex", formData.colorHex);
      if (formData.maxPostsPerDay)
        formDataToSend.append(
          "MaxPostsPerDay",
          formData.maxPostsPerDay.toString(),
        );
      if (formData.maxImagesPerPost)
        formDataToSend.append(
          "MaxImagesPerPost",
          formData.maxImagesPerPost.toString(),
        );
      if (formData.maxServices)
        formDataToSend.append("MaxServices", formData.maxServices.toString());
      if (formData.maxCollections)
        formDataToSend.append(
          "MaxCollections",
          formData.maxCollections.toString(),
        );
      if (formData.tier)
        formDataToSend.append("Tier", formData.tier.toString());

      var response = await subscriptionAPI.updateSub(
        subscriptionId,
        formDataToSend,
      );

      toast({
        description: response.message,
        variant: "success",
        duration: 3000,
      });

      setSubscription(formData);
      setEditMode(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast({
        description: error?.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Subscription not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-8">
        <div>
          <CardTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900">
            Cài đặt gói đăng ký
          </CardTitle>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Các cài đặt và giới hạn
          </p>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <Button
              onClick={() => setEditMode(true)}
              className="rounded-full px-6 bg-slate-900 font-black text-[10px] uppercase tracking-widest"
            >
              Cập nhật thông tin
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="rounded-full px-6 font-black text-[10px] uppercase tracking-widest text-slate-400"
                onClick={() => {
                  setFormData(subscription);
                  setEditMode(false);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full px-6 bg-[#950101] hover:bg-[#7a0101] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#950101]/20"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Section 1: Visual Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#950101]">
              Hình dáng và vẻ ngoài
            </h3>

            <div className="grid gap-6">
              {/* Icon Picker Block */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Icon gói đăng ký
                </label>
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    {formData.iconUrl &&
                      Icons[formData.iconUrl as keyof typeof Icons] ? (
                      React.createElement(
                        Icons[formData.iconUrl as keyof typeof Icons],
                        { className: "w-6 h-6 text-slate-900" },
                      )
                    ) : (
                      <Icons.FaGem className="w-6 h-6 text-slate-200" />
                    )}
                  </div>
                  {editMode ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        name="iconUrl"
                        value={formData.iconUrl || ""}
                        onChange={handleChange}
                        className="bg-white rounded-xl border-slate-200"
                        placeholder="Icon Name"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-xl border-slate-200"
                          >
                            <Icons.FaIcons />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 rounded-[2rem] overflow-hidden border-none shadow-2xl">
                          <Command className="rounded-[2rem]">
                            <CommandInput
                              placeholder="Search hundreds of icons..."
                              className="h-12 border-none focus:ring-0 font-medium"
                            />
                            <CommandEmpty className="p-4 text-xs font-bold text-slate-400 text-center italic">
                              No icons match your search.
                            </CommandEmpty>
                            <CommandGroup className="max-h-[300px] overflow-y-auto p-2">
                              {Object.keys(Icons)
                                .filter((key) => key !== "FaIcons") // Hide the main library icon if needed
                                .map((iconName) => {
                                  const IconComponent =
                                    Icons[iconName as keyof typeof Icons];

                                  // Basic safety check to ensure it's a valid component
                                  if (typeof IconComponent !== "function")
                                    return null;

                                  return (
                                    <CommandItem
                                      key={iconName}
                                      onSelect={() => {
                                        setFormData((prev: any) => ({
                                          ...prev,
                                          iconUrl: iconName,
                                        }));
                                      }}
                                      className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-2xl hover:bg-slate-50 transition-colors group"
                                    >
                                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                                        <IconComponent className="w-4 h-4 text-slate-600 group-hover:text-[#950101]" />
                                      </div>
                                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900">
                                        {iconName.replace(/^Fa/, "")}
                                      </span>
                                    </CommandItem>
                                  );
                                })}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-600 tracking-tight">
                      {subscription.iconUrl || "Default Gem"}
                    </span>
                  )}
                </div>
              </div>

              {/* Color/Gradient Block */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Màu sắc
                </label>
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                  <div
                    className="w-12 h-12 rounded-2xl shadow-inner shrink-0"
                    style={{ background: formData.colorHex || "#e2e8f0" }}
                  />
                  {editMode ? (
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {formData.colorHex?.includes("gradient")
                          ? "Gradient Mode"
                          : "Solid Color"}
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="rounded-xl border-slate-200"
                          >
                            <Palette className="w-4 h-4 mr-2" />
                            Tùy chỉnh
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 rounded-[2rem] border-none shadow-2xl p-6 bg-white space-y-6">
                          {/* 1. SOLID COLOR PICKER */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#950101]">
                              Màu đơn
                            </p>
                            <HexColorPicker
                              color={
                                formData.colorHex?.startsWith("#")
                                  ? formData.colorHex
                                  : "#950101"
                              }
                              onChange={(c) =>
                                setFormData({ ...formData, colorHex: c })
                              }
                              className="!w-full !h-32"
                            />
                          </div>

                          {/* 2. CUSTOM DUAL GRADIENT */}
                          <div className="space-y-3 pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#950101]">
                              Custom Gradient
                            </p>
                            <div className="flex gap-4 items-center">
                              <div className="flex-1 space-y-2">
                                <span className="text-[9px] text-slate-400 uppercase font-bold">
                                  Start
                                </span>
                                <div className="h-8 rounded-lg overflow-hidden border border-slate-100 relative">
                                  <input
                                    type="color"
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                    onChange={(e) =>
                                      handleCustomGradient(
                                        e.target.value,
                                        "start",
                                      )
                                    }
                                  />
                                  <div
                                    className="w-full h-full"
                                    style={{
                                      background:
                                        formData.colorHex?.match(
                                          /#[a-fA-F0-9]{6}/g,
                                        )?.[0] || "#950101",
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex-1 space-y-2">
                                <span className="text-[9px] text-slate-400 uppercase font-bold">
                                  End
                                </span>
                                <div className="h-8 rounded-lg overflow-hidden border border-slate-100 relative">
                                  <input
                                    type="color"
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                    onChange={(e) =>
                                      handleCustomGradient(
                                        e.target.value,
                                        "end",
                                      )
                                    }
                                  />
                                  <div
                                    className="w-full h-full"
                                    style={{
                                      background:
                                        formData.colorHex?.match(
                                          /#[a-fA-F0-9]{6}/g,
                                        )?.[1] || "#FF6B6B",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. SIGNATURE PRESETS */}
                          <div className="space-y-3 pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#950101]">
                              Sẵn có
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                "linear-gradient(135deg, #FF6B6B 0%, #950101 100%)",
                                "linear-gradient(135deg, #232526 0%, #414345 100%)",
                                "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
                                "linear-gradient(135deg, #E2E2E2 0%, #C9C9C9 100%)",
                              ].map((grad, i) => (
                                <button
                                  key={i}
                                  onClick={() =>
                                    setFormData({ ...formData, colorHex: grad })
                                  }
                                  className="h-8 rounded-lg border border-white hover:scale-105 transition-transform"
                                  style={{ background: grad }}
                                />
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400 truncate">
                      {subscription.colorHex || "#E2E8F0"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Duration */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#950101]">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Tên gói đăng ký
                </label>
                {editMode ? (
                  <Input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="rounded-2xl h-12"
                  />
                ) : (
                  <p className="text-lg font-black text-slate-900 tracking-tight">
                    {subscription.name || "-"}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Giá tiền
                </label>
                {editMode ? (
                  <Input
                    name="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={handleNumberChange}
                    className="rounded-2xl h-12"
                  />
                ) : (
                  <p className="text-lg font-black text-emerald-600 tracking-tight">
                    {subscription.price ? Number(subscription.price).toLocaleString() : "0"} đ

                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Mô tả
              </label>
              {editMode ? (
                <Textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="rounded-2xl"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-slate-500 font-medium italic">
                  "{subscription.description || "No description provided."}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Quotas & Limits */}
        <div className="pt-8 border-t border-slate-50">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#950101] mb-6">
            Các giới hạn
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Tổng số bài đăng/ngày", key: "maxPostsPerDay" },
              { label: "Tổng số ảnh/bài đăng", key: "maxImagesPerPost" },
              { label: "Tổng dịch vụ", key: "maxServices" },
              { label: "Tổng bộ sưu tập", key: "maxCollections" },
            ].map((limit) => (
              <div
                key={limit.key}
                className="p-4 rounded-[2rem] bg-slate-50/50 border border-slate-100 text-center"
              >
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  {limit.label}
                </label>
                {editMode ? (
                  <Input
                    name={limit.key}
                    type="number"
                    value={formData[limit.key as keyof typeof formData] || ""}
                    onChange={handleNumberChange}
                    className="h-8 text-center font-black bg-white rounded-xl"
                  />
                ) : (
                  <p className="text-xl font-black text-slate-900 tracking-tighter">
                    {subscription[limit.key as keyof typeof subscription] ||
                      "∞"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
