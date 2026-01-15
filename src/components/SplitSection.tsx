import Link from "next/link";
import React from "react";

interface SplitSectionProps {
    category: string;
    title: string;
    statement: string;
    mediaSrc: string;
    mediaType?: "image" | "video";
    reversed?: boolean;
}

export function SplitSection({
    category,
    title,
    statement,
    mediaSrc,
    mediaType = "image",
    reversed = false,
}: SplitSectionProps) {
    return (
        <div
            className={`w-full flex flex-col md:flex-row min-h-[80vh] border-b border-border ${reversed ? "md:flex-row-reverse" : ""
                }`}
        >
            {/* Media Side - 50% width on Desktop */}
            <div className="w-full md:w-1/2 relative bg-image-placeholder min-h-[50vh] md:min-h-auto border-b md:border-b-0 md:border-r border-border overflow-hidden group">
                {mediaType === "video" ? (
                    <video
                        src={mediaSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <img
                        src={mediaSrc}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                )}
            </div>

            {/* Content Side - 50% width on Desktop */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-6 md:p-12 lg:p-20 bg-background">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                            / {category}
                        </span>
                    </div>

                    <h2
                        className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground font-normal"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        {title}
                    </h2>

                    <p className="text-xl md:text-2xl font-light text-secondary leading-relaxed max-w-xl font-sans">
                        {statement}
                    </p>
                </div>

                <div className="mt-12 md:mt-auto">
                    <button className="text-sm font-bold uppercase tracking-widest border border-foreground/20 px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-500 ease-out">
                        View Project
                    </button>
                </div>
            </div>
        </div>
    );
}
