import { treatments } from "@/lib/data";
import { SectionLabel } from "@/components/SectionLabel";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TreatmentDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const treatment = treatments.find((t) => t.slug === slug);

    if (!treatment) {
        notFound();
    }

    return (
        <div className="px-5 md:px-12 w-full pb-20">
            {/* Header */}
            <section className="pt-[140px] md:pt-[160px] pb-[48px] border-b border-border">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 text-nav-link text-secondary">
                        <span>0{treatment.number}</span>
                        <span className="w-px h-4 bg-secondary/20"></span>
                        <span className="uppercase tracking-widest">{treatment.category}</span>
                    </div>
                    <h1 className="text-display max-w-[900px] leading-tight">
                        {treatment.title} <span className="text-secondary italic font-light ml-2 opacity-60 text-[0.6em] block md:inline md:align-middle">— {treatment.discipline}</span>
                    </h1>
                    <p className="text-meta text-secondary">{treatment.focus}</p>
                </div>
            </section>

            {/* Hero Image */}
            <div className="w-full aspect-video bg-image-placeholder my-[80px]"></div>

            {/* Overview */}
            <section className="pb-[64px]">
                <SectionLabel text="OVERVIEW" />
                <p className="text-body-large max-w-[640px]">{treatment.overview}</p>
            </section>

            {/* Material Approach */}
            <section className="pb-[64px]">
                <SectionLabel text="MATERIAL APPROACH" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {treatment.material_approach.map((item, i) => (
                        <div key={i}>
                            <h3 className="text-h3 mb-4">{item.title}</h3>
                            <ul className="list-disc pl-4 text-body space-y-2 marker:text-accent">
                                {item.points.map((pt, j) => (
                                    <li key={j}>{pt}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Specs */}
            <section className="pb-[80px] border-b border-border">
                <SectionLabel text="PRODUCTION NOTE" />
                <div className="flex flex-col gap-4 text-body max-w-[640px]">
                    <div className="grid grid-cols-[120px_1fr]">
                        <span className="text-secondary opacity-60">Timeline</span>
                        <span>{treatment.timeline}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                        <span className="text-secondary opacity-60">Deliverables</span>
                        <span>{treatment.deliverables}</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr]">
                        <span className="text-secondary opacity-60">Formats</span>
                        <span>{treatment.formats}</span>
                    </div>
                </div>
            </section>

            {/* Nav */}
            <div className="pt-12">
                <Link href="/treatments" className="text-nav-link hover:text-accent transition-colors">
                    ← All treatments
                </Link>
            </div>
        </div>
    );
}
