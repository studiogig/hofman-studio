import { SplitSection } from "@/components/SplitSection";
import React from "react";

export default function Treatments() {
    return (
        <div className="w-full bg-background min-h-screen">
            {/* Editorial Header */}
            <section className="pt-[180px] pb-[120px] px-6 md:px-12 w-full max-w-[1400px] mx-auto">
                <h1
                    className="text-[4rem] md:text-[6rem] lg:text-[7.5rem] leading-[0.9] text-foreground tracking-tight mb-8"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                >
                    Director&apos;s <br />
                    <span className="italic ml-[0.5em] font-light text-secondary">Treatments</span>
                </h1>
                <p className="font-sans text-lg md:text-xl font-light text-secondary max-w-2xl leading-relaxed ml-auto mt-12 md:mr-20 border-l border-foreground/10 pl-8">
                    We don't just make pretty pictures. We engineer visuals.
                    Methodology in practice. These treatments demonstrate how Depthfield approaches luxury production—process, not just output.
                </p>
            </section>

            {/* Split Layouts */}
            <div className="w-full flex flex-col border-t border-border">
                <SplitSection
                    category="Wild Rose Oil"
                    title="Merit Beauty"
                    statement="Capturing the viscosity and surface tension of rose oil at macroscopic scale. A study in golden light and fluid dynamics."
                    mediaSrc="/videos/Wild rose/kling_25_turbo_oil_drip_orbit_094147.mp4"
                    mediaType="video"
                    reversed={false}
                />

                <SplitSection
                    category="Precision Engineering"
                    title="Horology Report"
                    statement="The intersection of mechanical precision and light refraction. Exploring the microscopic details of luxury timepieces."
                    mediaSrc="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2959&auto=format&fit=crop"
                    mediaType="image"
                    reversed={true}
                />

                <SplitSection
                    category="Chrome & Liquid"
                    title="Gucci Flora"
                    statement="A brutalist approach to floral aesthetics. metallic surfaces meeting organic matter in high-contrast environments."
                    mediaSrc="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2787&auto=format&fit=crop"
                    mediaType="image"
                    reversed={false}
                />
            </div>

            {/* Contact Section */}
            <section className="py-[160px] px-6 md:px-12 w-full max-w-[1400px] mx-auto text-center">
                <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-8">Ready to collaborate?</h2>
                <a href="/contact" className="inline-block text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent transition-colors">
                    Start a conversation
                </a>
            </section>
        </div>
    );
}
