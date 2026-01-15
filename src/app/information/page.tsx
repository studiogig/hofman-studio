export default function Information() {
  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-16">
      <section className="mb-16">
        <h1 className="text-sm font-normal mb-6">About</h1>
        <p className="text-sm leading-relaxed text-black/70">
          Hofman Studio is a production practice applying material intelligence
          to luxury brands. We direct AI-native workflows for spirits, beauty,
          and fragrance, combining 15 years of photography and film expertise
          with emerging production technologies.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-sm font-normal mb-6">Approach</h2>
        <p className="text-sm leading-relaxed text-black/70 mb-4">
          Every project begins with material study. We understand how light
          interacts with glass, how liquids move, how surfaces reflect. This
          physical understanding informs how we direct AI tools to achieve
          craft-quality results at production speed.
        </p>
        <p className="text-sm leading-relaxed text-black/70">
          Our hybrid workflow combines traditional photography direction with
          AI generation and enhancement, maintaining the control and precision
          luxury brands require.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-sm font-normal mb-6">Services</h2>
        <ul className="text-sm leading-relaxed text-black/70 space-y-2">
          <li>Product photography direction</li>
          <li>Motion and film</li>
          <li>Concept development</li>
          <li>AI workflow consulting</li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-normal mb-6">Contact</h2>
        <a
          href="mailto:hello@hofman.studio"
          className="text-sm text-black hover:opacity-50 transition-opacity duration-300"
        >
          hello@hofman.studio
        </a>
      </section>
    </div>
  );
}
