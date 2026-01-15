import React from "react";

interface MethodologyItemProps {
    number: string;
    title: string;
    description?: string;
    children?: React.ReactNode;
    src: string;
    type?: 'image' | 'video';
    reversed?: boolean;
}

export function MethodologyItem({ number, title, description, children, src, type = 'image', reversed = false }: MethodologyItemProps) {
    const isVideo = type === 'video' || src.endsWith('.mp4') || src.endsWith('.mov');

    return (
        <div className={`w-full min-h-[80vh] flex flex-col lg:flex-row items-center py-16 md:py-20 lg:py-24 border-b border-border ${reversed ? 'lg:flex-row-reverse' : ''}`}>

            {/* Visual Side */}
            <div className={`w-full lg:w-[55%] xl:w-[58%] p-4 md:p-8 lg:p-8 ${reversed ? 'lg:pl-0' : 'lg:pr-0'}`}>
                <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-image-placeholder">
                    {isVideo ? (
                        <video
                            src={src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img src={src} alt="Methodology" className="w-full h-full object-cover" />
                    )}
                </div>
            </div>

            {/* Text Side */}
            <div className={`w-full lg:w-[45%] xl:w-[42%] p-6 md:p-12 lg:p-12 xl:p-16 flex flex-col justify-center`}>
                <span className="font-sans text-sm font-medium opacity-40 mb-8 md:mb-12 block">{number}</span>

                <h3
                    className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-foreground font-bold mb-6 md:mb-8 leading-[1.1]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                >
                    {title}
                </h3>

                <div className="font-sans text-base md:text-lg text-secondary opacity-80 max-w-lg leading-relaxed space-y-4 md:space-y-6">
                    {description && <p>{description}</p>}
                    {children}
                </div>
            </div>
        </div>
    );
}
