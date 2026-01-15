import React from "react";

export function About() {
    return (
        <section id="about" className="w-full py-24 px-6 md:px-12 bg-background border-t border-white/10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* Main Text */}
                <div>
                    <h2 className="font-serif text-3xl md:text-4xl mb-8 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                        Depthfield is a production studio directing AI for luxury brands.
                    </h2>
                    <p className="font-sans text-lg opacity-80 leading-relaxed max-w-md">
                        Founded by Sam Hofman — 15 years in film and photography, now applying that eye to a faster way of working. Based in London, working globally.
                    </p>
                </div>

                {/* Lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div>
                        <h3 className="font-sans text-xs tracking-[0.2em] uppercase opacity-40 mb-6">What We Do</h3>
                        <ul className="space-y-3 opacity-80 font-sans text-sm md:text-base">
                            <li>Campaign imagery (stills + motion)</li>
                            <li>Hybrid production (shot + AI-built)</li>
                            <li>Concept and treatment development</li>
                            <li>Format scaling and variations</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-sans text-xs tracking-[0.2em] uppercase opacity-40 mb-6">Who We Work With</h3>
                        <ul className="space-y-3 opacity-80 font-sans text-sm md:text-base">
                            <li>Spirits</li>
                            <li>Beauty</li>
                            <li>Fragrance</li>
                            <li>Luxury CPG</li>
                        </ul>
                        <p className="mt-6 opacity-60 text-sm italic">
                            Brands and agencies who need craft-quality production without traditional timelines.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
