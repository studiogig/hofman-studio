'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

// Work assets for splash - mix of stills and video clips
type Asset = { type: 'image' | 'video'; src: string };

const ALL_ASSETS: Asset[] = [
    // Stills
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Gucci_Absurtist_3.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__46843.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__73551.jpg' },
    { type: 'image', src: '/images/Merit/SH_Merti_s1.jpg' },
    { type: 'image', src: '/images/Merit/SH_Merti_S2.jpg' },
    // Video clips
    { type: 'video', src: '/videos/splash/SH_wild_rose_Edit_v6_00000002.mp4' },
    { type: 'video', src: '/videos/splash/kling_master21_topdown rose_141735_1_stab_chf3_prob4_00000000.mp4' },
    { type: 'video', src: '/videos/splash/kling_master21_topdown rose_171052_1_stab_chf3_prob4_00000000.mp4' },
    { type: 'video', src: '/videos/splash/2026-01-07T20-41-29_top_down_shot___3_stab_chr2_prob4_00000102.mp4' },
];

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

interface IntroSplashProps {
    onComplete: () => void;
}

export const IntroSplash = ({ onComplete }: IntroSplashProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'flash' | 'settle' | 'exit'>('flash');
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

    // Shuffle and pick 7 random assets on mount (mix of images and videos)
    const assets = useMemo(() => {
        const shuffled = shuffleArray(ALL_ASSETS);
        return shuffled.slice(0, 7);
    }, []);

    // Flash through assets - constant timing with smooth fades
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (phase === 'flash') {
            // If we've shown all assets, hold logo briefly then exit
            if (currentIndex >= assets.length - 1) {
                timeout = setTimeout(() => setPhase('exit'), 800);
                return () => clearTimeout(timeout);
            }

            // Constant 400ms per asset (includes 150ms fade)
            timeout = setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 400);

            return () => clearTimeout(timeout);
        } else if (phase === 'exit') {
            // Wait for exit animation then call onComplete
            timeout = setTimeout(() => {
                onComplete();
            }, 600); // Match the 0.6s exit animation

            return () => clearTimeout(timeout);
        }
    }, [phase, currentIndex, onComplete, assets]);

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
                        {assets.map((asset, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-150 ease-out ${
                                    index === currentIndex ? 'opacity-40' : 'opacity-0'
                                }`}
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, ease: luxuryEase, delay: 0.3 }}
                        >
                            <Logo className="h-32 md:h-48 w-auto text-black dark:text-white" />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            className="font-calibre text-sm md:text-base tracking-[0.2em] uppercase mt-6 text-black/60 dark:text-white/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
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
