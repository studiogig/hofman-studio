'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Word alternatives for each menu item - synonyms/related concepts with same letter count
const wordAlternatives: Record<string, string[]> = {
    'WORK': ['REEL', 'FILM', 'MADE', 'SHOW'],
    'METHODOLOGY': ['PERSPECTIVE', 'FOUNDATIONS', 'FABRICATION', 'PROPOSITION'],
    'CONTACT': ['ENQUIRE', 'DISCUSS', 'CONNECT', 'REACHUS'],
};

// Get random alternative word for the label
const getRandomWord = (label: string): string => {
    const alternatives = wordAlternatives[label];
    if (alternatives && alternatives.length > 0) {
        return alternatives[Math.floor(Math.random() * alternatives.length)];
    }
    return label;
};

// Flicker through random characters for a single letter
const getRandomChar = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)];
};

interface FlickerLinkProps {
    label: string;
    href: string;
    onClick: (e: React.MouseEvent, href: string, label: string) => void;
    isAnimating: boolean;
    animatingLabel: string | null;
    displayText: string;
}

const FlickerLink = ({ label, href, onClick, isAnimating, animatingLabel, displayText }: FlickerLinkProps) => {
    const isThisAnimating = isAnimating && animatingLabel === label;

    return (
        <button
            onClick={(e) => onClick(e, href, label)}
            className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-500 ease-out bg-transparent border-none cursor-pointer relative"
        >
            {/* Invisible label to hold the width */}
            <span className="invisible">{label}</span>
            {/* Actual displayed text positioned absolutely */}
            <span className="absolute inset-0 flex items-center justify-start">
                {isThisAnimating ? (
                    <span className="inline-flex">
                        {displayText.split('').map((char, i) => (
                            <span
                                key={i}
                                className="inline-block"
                                style={{
                                    opacity: Math.random() > 0.3 ? 1 : 0.6,
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </span>
                ) : (
                    label
                )}
            </span>
        </button>
    );
};

export const Navigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animatingLabel, setAnimatingLabel] = useState<string | null>(null);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        // On non-home pages, always show nav
        if (pathname !== '/') {
            setIsVisible(true);
            return;
        }

        // On home page, show nav after scrolling past splash
        const handleScroll = () => {
            setIsVisible(window.scrollY > window.innerHeight - 100);
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const handleClick = useCallback((e: React.MouseEvent, href: string, label: string) => {
        e.preventDefault();

        if (isAnimating) return;

        setIsAnimating(true);
        setAnimatingLabel(label);

        const totalDuration = 1800; // Total animation time
        const flickerInterval = 120; // How fast letters flicker
        const wordChangeInterval = 350; // How fast words change

        let elapsed = 0;
        let currentWord = label;

        // Start the flicker animation
        const flickerTimer = setInterval(() => {
            elapsed += flickerInterval;

            // Change to a new random word periodically
            if (elapsed % wordChangeInterval === 0) {
                currentWord = getRandomWord(label);
            }

            // Flicker individual letters
            const flickered = currentWord.split('').map((char, i) => {
                // More chance of random char early, settling to real char later
                const settleProgress = elapsed / totalDuration;
                const shouldSettle = Math.random() < settleProgress * settleProgress;

                if (shouldSettle && elapsed > totalDuration * 0.7) {
                    // Start settling back to original label
                    return label[i] || char;
                }
                return Math.random() > 0.4 ? char : getRandomChar();
            }).join('');

            setDisplayText(flickered);

            // End animation and navigate
            if (elapsed >= totalDuration) {
                clearInterval(flickerTimer);
                setDisplayText(label);

                // Small delay then navigate
                setTimeout(() => {
                    setIsAnimating(false);
                    setAnimatingLabel(null);
                    router.push(href);
                }, 100);
            }
        }, flickerInterval);
    }, [isAnimating, router]);

    const links = [
        { label: 'WORK', href: '/#work' },
        { label: 'METHODOLOGY', href: '/methodology' },
        { label: 'CONTACT', href: '/#contact' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] h-[60px] md:h-[80px] px-6 md:px-12 flex items-center justify-between transition-all duration-700 ease-out transform",
                isVisible ? "translate-y-0 opacity-100 bg-background/95 backdrop-blur-md" : "-translate-y-full opacity-0 pointer-events-none"
            )}
        >
            <Link
                href="/"
                className="font-serif font-bold text-lg md:text-xl tracking-wide text-foreground"
                style={{ fontFamily: 'var(--font-playfair)' }}
            >
                SOFT ASSEMBLY
            </Link>

            {/* Links */}
            <div className="flex gap-8 md:gap-12">
                {links.map((link) => (
                    <FlickerLink
                        key={link.href}
                        label={link.label}
                        href={link.href}
                        onClick={handleClick}
                        isAnimating={isAnimating}
                        animatingLabel={animatingLabel}
                        displayText={displayText}
                    />
                ))}
            </div>
        </nav>
    );
};
