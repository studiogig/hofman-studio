'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

// Refined easing curve - smooth luxury feel
const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pageVariants = {
    initial: {
        x: '8%',
        opacity: 0,
    },
    enter: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.7,
            ease: luxuryEase,
        },
    },
    exit: {
        x: '-8%',
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: luxuryEase,
        },
    },
};

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
