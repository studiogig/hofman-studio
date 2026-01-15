'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ASSETS = [
    { type: 'image', src: '/images/Watch report/freepik__enhance__46843.jpg' },
    { type: 'video', src: '/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4' },
    { type: 'image', src: '/images/Merit/freepik__enhance__74134.jpg' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg' },
    { type: 'video', src: '/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4' },
    { type: 'image', src: '/images/Watch report/freepik__enhance__73551.jpg' },
    { type: 'image', src: '/images/Merit/SH_t9w9cp.jpg' },
    { type: 'video', src: '/videos/Wild rose/2026-01-07T21-52-22_luma_prompt__.mp4' },
];

export const Splash = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSlowMode, setIsSlowMode] = useState(false);
    const [scrollOpacity, setScrollOpacity] = useState(1);

    // Scroll-based fade effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            // Start fading at 30% scroll, fully faded by 80%
            const fadeStart = windowHeight * 0.3;
            const fadeEnd = windowHeight * 0.8;

            if (scrollY <= fadeStart) {
                setScrollOpacity(1);
            } else if (scrollY >= fadeEnd) {
                setScrollOpacity(0);
            } else {
                const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
                setScrollOpacity(1 - progress);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Asset Cycling Logic (Option C: Hybrid)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (!isSlowMode) {
            // Fast Strobe Phase (0.3s)
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % ASSETS.length);
            }, 300);

            // Switch to slow mode after 3 seconds
            const slowModeTimeout = setTimeout(() => {
                setIsSlowMode(true);
            }, 3000);

            return () => {
                clearInterval(interval);
                clearTimeout(slowModeTimeout);
            };
        } else {
            // Slow Burn Phase (2s hold)
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % ASSETS.length);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [isSlowMode]);

    // Split Reveal Animation (Option C: Cinematic)
    // "DEPTHFIELD" slides in from left, "STUDIO" slides in from right
    const leftWord = "SOFT";
    const rightWord = "ASSEMBLY";

    // Refined luxury easing
    const luxuryEase = [0.22, 1, 0.36, 1] as const;

    const slideFromLeft = {
        hidden: { x: -60, opacity: 0 },
        show: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: luxuryEase,
                delay: 0.3,
            },
        },
    };

    const slideFromRight = {
        hidden: { x: 60, opacity: 0 },
        show: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 1,
                ease: luxuryEase,
                delay: 0.3,
            },
        },
    };

    // Center line animation
    const centerLine = {
        hidden: { scaleY: 0, opacity: 0 },
        show: {
            scaleY: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: luxuryEase,
                delay: 0.1,
            },
        },
        exit: {
            scaleY: 0,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: luxuryEase,
                delay: 1.0,
            },
        },
    };

    // Background stays mostly visible (fades to 70% opacity min), text fades fully
    const bgOpacity = Math.max(0.7, scrollOpacity);

    return (
        <section
            className="fixed inset-0 w-full h-screen z-0 overflow-hidden bg-background pointer-events-none transition-opacity duration-300"
            style={{ opacity: bgOpacity }}
        >

            {/* 1. BACKGROUND LAYER — Flickering Montage (fades partially) */}
            <div className="absolute inset-0 w-full h-full opacity-50">
                {ASSETS.map((asset, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {asset.type === 'video' ? (
                            <video
                                src={asset.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={asset.src}
                                alt=""
                                className={`w-full h-full object-cover ${
                                    index === currentIndex ? 'scale-105' : 'scale-100'
                                } transition-transform duration-[2000ms]`}
                            />
                        )}
                        {/* Color unification overlay */}
                        <div className="absolute inset-0 bg-background/50 mix-blend-multiply" />
                    </div>
                ))}
            </div>

            {/* 2. TYPOGRAPHY LAYER — Split Reveal (fades on scroll) */}
            <div
                className="relative z-10 w-full h-full flex flex-col items-center justify-center text-foreground transition-opacity duration-300"
                style={{ opacity: scrollOpacity }}
            >

                {/* LOGO: Split Reveal Animation */}
                <div className="flex items-center justify-center">
                    {/* DEPTH — slides from left */}
                    <motion.span
                        className="font-serif font-bold text-[14vw] md:text-[10vw] leading-none tracking-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                        variants={slideFromLeft}
                        initial="hidden"
                        animate="show"
                    >
                        {leftWord}
                    </motion.span>

                    {/* Center divider line (appears first, fades after words meet) */}
                    <motion.div
                        className="w-[2px] h-[8vw] md:h-[6vw] bg-foreground/30 mx-2 md:mx-4 origin-center"
                        variants={centerLine}
                        initial="hidden"
                        animate={["show", "exit"]}
                    />

                    {/* FIELD — slides from right */}
                    <motion.span
                        className="font-serif font-bold text-[14vw] md:text-[10vw] leading-none tracking-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                        variants={slideFromRight}
                        initial="hidden"
                        animate="show"
                    >
                        {rightWord}
                    </motion.span>
                </div>

                {/* TAGLINE — fades in after logo settles */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="font-sans text-xs md:text-base tracking-[0.25em] uppercase mt-8 md:mt-10 text-center"
                >
                    Material intelligence for luxury production
                </motion.p>
            </div>

            {/* 3. SCROLL INDICATOR — appears after sequence */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 pointer-events-auto"
                onClick={() => {
                    window.scrollTo({
                        top: window.innerHeight,
                        behavior: 'smooth'
                    });
                }}
            >
                <motion.div
                    className="w-[1px] h-14 bg-foreground/60"
                    animate={{ scaleY: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="w-2 h-2 border-r border-b border-foreground/60 rotate-45"
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

        </section>
    );
};
