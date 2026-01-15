import React from "react";

interface ProjectProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const Project = ({ title, subtitle, children }: ProjectProps) => {
    return (
        <div className="w-full flex flex-col mb-24 last:mb-0">
            {/* Header in gap between projects */}
            <div className="w-full px-6 md:px-12 py-6 flex items-baseline gap-4">
                <span className="font-serif text-2xl md:text-3xl text-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {title}
                </span>
                <span className="font-sans text-sm text-foreground/60">
                    {subtitle}
                </span>
            </div>

            {/* Project Media Content */}
            <div className="w-full flex flex-col gap-4">
                {children}
            </div>
        </div>
    );
};
