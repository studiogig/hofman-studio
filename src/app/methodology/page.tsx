"use client";

import { useState, useEffect } from "react";
import { MethodologyItem } from "@/components/MethodologyItem";

// Background assets - only from the methodology section items
const BACKGROUND_ASSETS = [
    { type: 'video', src: '/videos/Asbstracts/SH_SAB_Motion_02.mp4' },
    { type: 'video', src: '/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4' },
    { type: 'video', src: '/videos/Asbstracts/SH_Sisley_Animation.mp4' },
    { type: 'image', src: '/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x_2.jpg' },
];

export default function MethodologyPage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cycle through backgrounds (slow burn - 3s each)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BACKGROUND_ASSETS.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Fixed Background Layer - cycling through assets */}
            <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden bg-background">
                <div className="absolute inset-0 w-full h-full opacity-50">
                    {BACKGROUND_ASSETS.map((asset, index) => (
                        asset.type === 'video' ? (
                            <video
                                key={asset.src}
                                src={asset.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
                                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ) : (
                            <img
                                key={asset.src}
                                src={asset.src}
                                alt=""
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
                                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        )
                    ))}
                </div>
            </div>

            {/* Content Layer */}
            <div className="w-full relative z-10 bg-background/85">
                {/* Page Header */}
                <section className="w-full pt-32 pb-16 md:pt-40 md:pb-20">
                    <div className="max-w-[900px] mx-auto px-6 md:px-12">
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl text-foreground font-bold mb-6 leading-[1.1]"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            Methodology
                        </h1>
                        <p className="text-body-large text-secondary/80 leading-relaxed max-w-[700px]">
                            How we think about AI in luxury production. Not as automation, but as a new kind of creative tool that still requires direction, craft, and intention.
                        </p>
                    </div>
                </section>

                {/* Methodology Items */}
                <section className="w-full">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">

                        {/* Section 1: The Approach */}
                        <MethodologyItem
                            number="01"
                            title="A director's eye, not a prompt engineer's guess."
                            src="/videos/Asbstracts/SH_SAB_Motion_02.mp4"
                        >
                            <p className="mb-4">
                                Our background is still life and tabletop production. Years spent working with light, materials, motion, and control.
                            </p>
                            <p className="mb-4">
                                That craft doesn't disappear in AI. It becomes the framework that guides it.
                            </p>
                            <p>
                                Liquids need weight. Glass needs depth. Movement needs intention. If it wouldn't make sense on a real set, it doesn't make sense here.
                            </p>
                        </MethodologyItem>

                        {/* Section 2: Concept */}
                        <MethodologyItem
                            number="02"
                            title="Concept, then movement."
                            src="/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4"
                            reversed={true}
                        >
                            <p className="mb-4">
                                Narrative isn't about plot. It's about progression.
                            </p>
                            <p className="mb-4">
                                A moment unfolding. A product revealed. An atmosphere built over time.
                            </p>
                            <p>
                                Sometimes that's a single frame. Sometimes it's motion. Often it's both. The language stays the same. Only the format changes.
                            </p>
                        </MethodologyItem>

                        {/* Section 3: Directed */}
                        <MethodologyItem
                            number="03"
                            title="Directed, not automated."
                            src="/videos/Asbstracts/SH_Sisley_Animation.mp4"
                        >
                            <p className="mb-4">
                                Nothing here is one-click. Nothing is left unattended.
                            </p>
                            <p className="mb-4">
                                Images and motion are shaped through reference, iteration, and adjustment — the same way a shoot evolves.
                            </p>
                            <p>
                                AI responds to direction. It doesn't replace it.
                            </p>
                        </MethodologyItem>

                        {/* Section 4: Creative Range */}
                        <MethodologyItem
                            number="04"
                            title="Room to push ideas."
                            src="/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x_2.jpg"
                            reversed={true}
                        >
                            <p className="mb-4">
                                AI gives us space to think properly.
                            </p>
                            <p className="mb-4">
                                Concepts can be sketched, tested, rebuilt, and refined early — before time, cost, or logistics limit what's possible.
                            </p>
                            <p>
                                We can explore environments that never made sense to build. Interactions that were too complex to shoot. Transitions that used to live only in treatments. This isn't speed for its own sake. It's creative range.
                            </p>
                        </MethodologyItem>

                    </div>
                </section>
            </div>
        </>
    );
}
