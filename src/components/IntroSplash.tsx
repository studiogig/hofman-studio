'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

// Work assets for splash - mix of stills and video clips
type Asset = { type: 'image' | 'video'; src: string };

const ASSETS: Asset[] = [
    // Stills
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Gucci_Absurtist_3.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__46843.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__73551.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__83979.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__83980.jpg' },
    { type: 'image', src: '/images/Merit/SH_Merti_s1.jpg' },
    { type: 'image', src: '/images/Merit/SH_Merti_S2.jpg' },
    // Wild Rose video clips
    { type: 'video', src: '/videos/Wild rose/Clips for splash/SH_wild_rose_Edit_v6_00000002.mp4' },
    { type: 'video', src: '/videos/Wild rose/Clips for splash/kling_master21_topdown rose_141735_1_stab_chf3_prob4_00000000.mp4' },
    { type: 'video', src: '/videos/Wild rose/Clips for splash/kling_master21_topdown rose_171052_1_stab_chf3_prob4_00000000.mp4' },
    { type: 'video', src: '/videos/Wild rose/Clips for splash/2026-01-07T20-41-29_top_down_shot___3_stab_chr2_prob4_00000102.mp4' },
];

interface IntroSplashProps {
    onComplete: () => void;
}

export const IntroSplash = ({ onComplete }: IntroSplashProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'flash' | 'settle' | 'exit'>('flash');
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

    // Fast flash through assets, then settle, then exit
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (phase === 'flash') {
            // Flash phase - 150ms per asset
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % ASSETS.length);
            }, 150);

            // After 2 seconds, settle on one asset
            const settleTimeout = setTimeout(() => {
                setPhase('settle');
            }, 2000);

            return () => {
                clearInterval(interval);
                clearTimeout(settleTimeout);
            };
        } else if (phase === 'settle') {
            // Hold for 1.5 seconds then exit
            const exitTimeout = setTimeout(() => {
                setPhase('exit');
            }, 1500);

            return () => clearTimeout(exitTimeout);
        } else if (phase === 'exit') {
            // Wait for exit animation then call onComplete
            const completeTimeout = setTimeout(() => {
                onComplete();
            }, 800);

            return () => clearTimeout(completeTimeout);
        }
    }, [phase, onComplete]);

    // Play/pause videos based on visibility
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (index === currentIndex) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, [currentIndex]);

    // Click to skip
    const handleClick = () => {
        if (phase !== 'exit') {
            setPhase('exit');
        }
    };

    const luxuryEase = [0.22, 1, 0.36, 1] as const;

    return (
        <AnimatePresence>
            {phase !== 'exit' ? (
                <motion.div
                    className="fixed inset-0 z-[200] bg-white dark:bg-[#1a1a1a] overflow-hidden cursor-pointer"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: luxuryEase }}
                    onClick={handleClick}
                >
                    {/* Background media flash */}
                    <div className="absolute inset-0 w-full h-full">
                        {ASSETS.map((asset, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 w-full h-full transition-opacity ${
                                    phase === 'flash' ? 'duration-0' : 'duration-500'
                                } ${index === currentIndex ? 'opacity-40' : 'opacity-0'}`}
                            >
                                {asset.type === 'video' ? (
                                    <video
                                        ref={(el) => {
                                            if (el) videoRefs.current.set(index, el);
                                            else videoRefs.current.delete(index);
                                        }}
                                        src={asset.src}
                                        muted
                                        playsInline
                                        loop
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={asset.src}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Center content */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        {/* Hofman/Studio Logo */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
                        >
                            <Logo className="h-32 md:h-48 w-auto text-black dark:text-white" />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            className="font-calibre text-sm md:text-base tracking-[0.2em] uppercase mt-6 text-black/60 dark:text-white/60"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.6 }}
                        >
                            Material Intelligence
                        </motion.p>

                        {/* Subtle line */}
                        <motion.div
                            className="w-16 h-[1px] bg-black/20 dark:bg-white/20 mt-8"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, ease: luxuryEase, delay: 0.9 }}
                        />
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};
