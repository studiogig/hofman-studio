import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TreatmentCardProps {
    number: number;
    title: string;
    discipline: string;
    href: string;
    imageSrc?: string;
    videoSrc?: string;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
    number,
    title,
    discipline,
    href,
    imageSrc,
    videoSrc,
}) => {
    return (
        <Link href={href} className="flex flex-col gap-6 group cursor-pointer w-full">
            <div className="flex items-baseline gap-5">
                <span className="text-nav-link text-secondary tabular-nums opacity-60">
                    0{number}
                </span>
                <h2 className="text-h2 group-hover:text-accent transition-colors duration-500 ease-out">
                    {title} <span className="text-secondary opacity-60 font-normal italic text-[0.85em] ml-2"> — {discipline}</span>
                </h2>
            </div>

            <div className="w-full aspect-video relative overflow-hidden bg-image-placeholder h-full">
                {videoSrc ? (
                    <video
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                ) : imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={`${title} treatment`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                ) : null}
            </div>
        </Link>
    );
};
