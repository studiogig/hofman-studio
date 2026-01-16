'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

const ASSETS = [
    { type: 'image', src: '/images/Watch report/freepik__enhance__46843.jpg' },
    { type: 'image', src: '/images/Merit/freepik__enhance__74134.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__73551.jpg' },
    { type: 'image', src: '/images/Merit/SH_t9w9cp.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__83979.jpg' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__83980.jpg' },
];

interface IntroSplashProps {
    onComplete: () => void;
}

export const IntroSplash = ({ onComplete }: IntroSplashProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState<'flash' | 'settle' | 'exit'>('flash');

    // Fast flash through images, then settle, then exit
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (phase === 'flash') {
            // Fast strobe phase - 100ms per image
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % ASSETS.length);
            }, 100);

            // After 2 seconds, settle on one image
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
            }, 1000);

            return () => clearTimeout(completeTimeout);
        }
    }, [phase, onComplete]);

    const luxuryEase = [0.22, 1, 0.36, 1] as const;

    return (
        <AnimatePresence>
            {phase !== 'exit' ? (
                <motion.div
                    className="fixed inset-0 z-[200] bg-white dark:bg-[#1a1a1a] overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: luxuryEase }}
                >
                    {/* Background image flash */}
                    <div className="absolute inset-0 w-full h-full">
                        {ASSETS.map((asset, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 w-full h-full transition-opacity ${
                                    phase === 'flash' ? 'duration-0' : 'duration-500'
                                } ${index === currentIndex ? 'opacity-40' : 'opacity-0'}`}
                            >
                                <img
                                    src={asset.src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
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
