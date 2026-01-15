import React from "react";

interface WorkItemProps {
    number: string;
    title: string;
    tag: string;
    src: string;
    type?: "video" | "image";
}

export function WorkItem({ number, title, tag, src, type = "image" }: WorkItemProps) {
    return (
        <div className="relative w-full h-screen sticky top-0 overflow-hidden bg-background">
            {/* Media Background */}
            <div className="absolute inset-0 w-full h-full">
                {type === "video" ? (
                    <video
                        src={src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={src}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                )}
                {/* Subtle Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Text Overlay - Bottom Left */}
            <div className="absolute bottom-10 left-6 md:left-12 text-white z-10 w-full max-w-screen-md mix-blend-difference pointer-events-none">
                <div className="flex flex-col gap-1">
                    <span className="font-sans font-medium text-sm md:text-base tracking-wide flex gap-3">
                        <span className="opacity-60">{number}</span>
                        <span>— {title}</span>
                    </span>
                    <span className="font-sans text-sm md:text-base opacity-70 tracking-wide pl-[calc(2ch+12px)]">
                        {tag}
                    </span>
                </div>
            </div>
        </div>
    );
}
