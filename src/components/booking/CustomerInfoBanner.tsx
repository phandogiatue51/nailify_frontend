import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

const CustomerInfoBanner = ({ profile }) => {
    if (!profile) return null;

    return (
        <div className="max-w-6xl mx-auto px-6 pt-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-[#950101]/5 border border-[#FFCFE9] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-[#950101]/10">
                <div className="flex items-start gap-4 w-full">
                    <div className="space-y-1 w-full">
                        {/* Name and Phone Row */}
                        <div className="flex items-center flex-wrap gap-2 md:gap-4">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-[#D81B60]" strokeWidth={2.5} />
                                <p className="font-bold text-lg text-slate-900 leading-none">
                                    {profile.fullName}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 ml-6">
                                <Phone size={14} className="text-[#D81B60]" strokeWidth={2} />
                                <span className="text-xs font-semibold text-slate-600">
                                    {profile.phone}
                                </span>
                            </div>
                        </div>
                        {profile.address && (
                            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                                <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                                    <MapPin size={14} className="text-[#D81B60]" strokeWidth={2} />
                                    <span className="text-xs font-medium truncate max-w-[300px] md:max-w-full">
                                        {profile.address || "No address provided"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfoBanner;