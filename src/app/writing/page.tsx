import { SectionLabel } from "@/components/SectionLabel";
import Link from "next/link";

export default function Writing() {
    const articles = [
        {
            title: "Material Intelligence: Why Luxury Brands Need AI Material Physics (Not Prompt Engineering)",
            date: "January 2026",
            excerpt: "Prompt engineering ≠ craft knowledge. 15 years of material physics expertise is the differentiator for luxury CPG production.",
            href: "https://medium.com/@samhofman/material-intelligence"
        },
        {
            title: "Treatment Writing for AI Production: A Practitioner's Guide",
            date: "February 2026",
            excerpt: "How director's treatments differ from portfolio work. Material physics in commercial briefs.",
            href: "https://medium.com/@samhofman/treatment-writing"
        },
        {
            title: "The 6-18 Month Window: Why Luxury CPG Needs AI Specialists Now",
            date: "February 2026",
            excerpt: "Corporate studios haven't pivoted yet. Opportunity for specialist practitioner-directors.",
            href: "https://medium.com/@samhofman/window"
        }
    ];

    return (
        <div className="px-5 md:px-12 w-full pb-20">
            <section className="pt-[140px] md:pt-[160px] pb-[80px]">
                <h1 className="text-display max-w-[900px]">Practitioner methodology</h1>
                <p className="text-body-large mt-6 max-w-[640px]">
                    Articles on AI production for luxury CPG—material physics, commercial systems, industry perspective.
                </p>
            </section>

            <section className="pb-[120px]">
                <SectionLabel text="ARTICLES" />
                <div className="flex flex-col">
                    {articles.map((article, i) => (
                        <Link key={i} href={article.href} target="_blank" className="group flex flex-col md:flex-row gap-4 md:gap-12 py-8 border-b border-border hover:bg-black/[0.01] transition-colors">
                            <div className="text-meta w-[120px] shrink-0 pt-1">{article.date}</div>
                            <div className="flex-1">
                                <h3 className="text-h3 group-hover:text-accent transition-colors mb-2">{article.title}</h3>
                                <p className="text-body max-w-2xl">{article.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
