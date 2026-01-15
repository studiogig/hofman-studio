import Link from "next/link";
import React from "react";

export const Footer = () => {
    return (
        <footer id="contact" className="w-full bg-[#0A1628] text-[#F8F6F3] py-[15vh] px-6 md:px-12 flex flex-col items-center justify-center text-center">
            <span className="font-sans text-xs md:text-sm tracking-[0.2em] opacity-60 mb-12 uppercase">
                Initiate Project
            </span>

            <a
                href="mailto:hello@depthfield.com"
                className="font-serif font-bold text-[8vw] leading-none hover:text-[#D4A574] transition-colors duration-500 ease-out"
                style={{ fontFamily: 'var(--font-playfair)' }}
            >
                hello@depthfield.com
            </a>

            <span className="font-sans text-xs md:text-sm tracking-[0.2em] opacity-60 mt-20 uppercase">
                London
            </span>
        </footer>
    );
};
