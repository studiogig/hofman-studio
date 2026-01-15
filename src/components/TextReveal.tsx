"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    align?: "left" | "center" | "right";
}

export const TextReveal = ({ text, className, delay = 0, align = "left" }: TextRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    const characterVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 15,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1], // Luxury ease-out curve
            }
        },
    };

    // Split text into words to allow wrapping, then characters
    const words = text.split(" ");

    return (
        <motion.h1
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={mainControls}
            className={cn(
                "flex flex-wrap gap-x-[0.3em] gap-y-2",
                align === "center" && "justify-center",
                align === "right" && "justify-end",
                className
            )}
            aria-label={text}
        >
            {words.map((word, i) => (
                <span key={i} className="whitespace-nowrap flex">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            variants={characterVariants}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.h1>
    );
};
