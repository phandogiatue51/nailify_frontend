import React from "react";
import { BlogPost } from "@/types/database";
import { useNavigate } from "react-router-dom";
export const BlogPostView: React.FC<{ post: BlogPost }> = ({ post }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (post.shopId) {
            navigate(`/shop/${post.shopId}`);
        } else if (post.nailArtistId) {
            navigate(`/artist/${post.nailArtistId}`);
        }
    };
    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#FFCFE9]/50 flex items-center justify-center border border-[#FFCFE9] overflow-hidden">
                    {post.authorAvatarUrl ? (
                        <img
                            src={post.authorAvatarUrl}
                            className="w-full h-full object-cover"
                            alt={post.authorName}
                        />
                    ) : (
                        <span className="text-lg font-black text-[#950101]">
                            {post.authorName?.charAt(0) || "U"}
                        </span>
                    )}
                </div>
                <div>
                    <h4
                        className="text-sm font-black text-slate-900 leading-none mb-1.5 tracking-tight cursor-pointer hover:underline"
                        onClick={handleClick}
                    >
                        {post.authorName || "Unknown Artist"}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Hero Title */}
            <h1 className="text-2xl font-black text-slate-900 leading-[1.1] mb-4 tracking-tight">
                {post.title}
            </h1>

            {/* Main Content Body */}
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium mb-4">
                    {post.content}
                </p>
            </div>

            {/* Immersive Image Stack - No more small squares! */}
            {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="space-y-6">
                    {post.imageUrls.map((url: string, index: number) => (
                        <div
                            key={index}
                            className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm"
                        >
                            <img
                                src={url}
                                alt={`Gallery ${index}`}
                                className="w-full h-auto object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};