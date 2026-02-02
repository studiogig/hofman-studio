'use client';

type InfoItem = {
  title: string;
  content: string;
  isEmail?: boolean;
};

type ArticleItem = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string[];
};

type InfoSectionProps = {
  item: InfoItem;
};

// Single info section - identical layout for portrait OR each half of landscape
// Layout: mixed fonts - Calibre for opening line, serif for body
export function InfoSection({ item }: InfoSectionProps) {
  // Split content: first paragraph is the hook (Calibre), rest is body (serif)
  const paragraphs = item.content.split('\n\n');
  const hook = paragraphs[0];
  const body = paragraphs.slice(1);

  return (
    <div
      className="flex flex-col justify-center items-center w-full h-full"
      style={{ padding: 'var(--info-padding)' }}
    >
      <div className="max-w-xl text-center">
        {item.isEmail ? (
          <a
            href={`mailto:${item.content}`}
            className="hover:opacity-50 transition-opacity duration-300 text-black dark:text-white block"
            style={{
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              lineHeight: '1.5',
            }}
          >
            {item.content}
          </a>
        ) : (
          <>
            {/* Hook - Calibre, larger, bold presence */}
            <p
              className="text-black dark:text-white"
              style={{
                fontFamily: 'Calibre, Arial, sans-serif',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                lineHeight: '1.3',
                fontWeight: 500,
                marginBottom: '2rem',
              }}
            >
              {hook}
            </p>

            {/* Divider line */}
            <div
              className="mx-auto bg-black/20 dark:bg-white/20"
              style={{
                width: '3rem',
                height: '1px',
                marginBottom: '2rem',
              }}
            />

            {/* Body - Serif, slightly smaller, more readable */}
            {body.map((para: string, i: number) => (
              <p
                key={i}
                className="text-black/80 dark:text-white/80"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                  lineHeight: '1.6',
                  marginBottom: i < body.length - 1 ? '1.5rem' : 0,
                }}
              >
                {para}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

type InfoOverlayProps = {
  isLandscape: boolean;
  infoItem: InfoItem;
  infoItem2?: InfoItem | null;
  onClose: () => void;
};

// Info overlay container
// Portrait: single InfoSection fills the frame
// Landscape: split in 2 with divider line, each half is independent frame with same layout as portrait
export function InfoOverlay({ isLandscape, infoItem, infoItem2, onClose }: InfoOverlayProps) {
  // PORTRAIT: Single section fills the whole frame
  if (!isLandscape) {
    return (
      <div
        className="absolute inset-0 cursor-pointer bg-white/40 dark:bg-[#1a1a1a]/40"
        onClick={onClose}
      >
        <InfoSection item={infoItem} />
      </div>
    );
  }

  // LANDSCAPE: Split into 2 halves with divider line
  // Each half is treated as independent frame (same layout as portrait)
  return (
    <div
      className="absolute inset-0 flex cursor-pointer bg-white/40 dark:bg-[#1a1a1a]/40"
      onClick={onClose}
    >
      {/* Left half - first section */}
      <div className="h-full flex-1">
        <InfoSection item={infoItem} />
      </div>

      {/* Divider line - runs full height with padding inset */}
      <div
        className="h-full flex-shrink-0"
        style={{
          width: 'var(--info-divider-width)',
          paddingTop: 'var(--info-padding)',
          paddingBottom: 'var(--info-padding)',
        }}
      >
        <div className="bg-black/50 dark:bg-white/50 w-full h-full" />
      </div>

      {/* Right half - second section (or empty if no content) */}
      <div className="h-full flex-1">
        {infoItem2 ? (
          <InfoSection item={infoItem2} />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    </div>
  );
}

type ArticleSectionProps = {
  article: ArticleItem;
};

// Single article section - identical layout for portrait OR each half of landscape
// Layout: title at top, subtitle, then scrollable content
function ArticleSection({ article }: ArticleSectionProps) {
  return (
    <div
      className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden"
      style={{
        padding: 'var(--info-padding)',
        scrollbarWidth: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Article title at top-left - lots of breathing room */}
      <h2
        className="font-bold uppercase tracking-tight leading-tight text-black dark:text-white flex-shrink-0"
        style={{
          fontFamily: 'Calibre, Arial, sans-serif',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          marginBottom: '3rem',
        }}
      >
        {article.title}
      </h2>

      {/* Subtitle / Summary - larger for quick read */}
      <p
        className="text-black/70 dark:text-white/70 flex-shrink-0"
        style={{
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)',
          lineHeight: '1.5',
          marginBottom: '5rem',
        }}
      >
        {article.subtitle}
      </p>

      {/* Article content */}
      <div className="flex-1">
        {article.content.map((paragraph, index) => (
          <p
            key={index}
            className="text-black dark:text-white mb-8"
            style={{
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
              lineHeight: '1.8',
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

type ArticleOverlayProps = {
  isLandscape: boolean;
  article: ArticleItem;
  article2?: ArticleItem | null;
  onClose: () => void;
};

// Article overlay container
// Portrait: single ArticleSection fills the frame
// Landscape: split in 2 with divider line, each half is independent frame with same layout as portrait
export function ArticleOverlay({ isLandscape, article, article2, onClose }: ArticleOverlayProps) {
  // PORTRAIT: Single section fills the whole frame
  if (!isLandscape) {
    return (
      <div
        className="absolute inset-0 overflow-hidden bg-white/70 dark:bg-[#1a1a1a]/70 cursor-pointer"
        onClick={onClose}
      >
        <ArticleSection article={article} />
      </div>
    );
  }

  // LANDSCAPE: Split into 2 halves with divider line
  // Each half is treated as independent frame (same layout as portrait)
  return (
    <div
      className="absolute inset-0 flex overflow-hidden bg-white/70 dark:bg-[#1a1a1a]/70 cursor-pointer"
      onClick={onClose}
    >
      {/* Left half - first article */}
      <div className="h-full flex-1 overflow-hidden">
        <ArticleSection article={article} />
      </div>

      {/* Divider line - runs full height with padding inset */}
      <div
        className="h-full flex-shrink-0"
        style={{
          width: 'var(--info-divider-width)',
          paddingTop: 'var(--info-padding)',
          paddingBottom: 'var(--info-padding)',
        }}
      >
        <div className="bg-black/50 dark:bg-white/50 w-full h-full" />
      </div>

      {/* Right half - second article (or empty if no content) */}
      <div className="h-full flex-1 overflow-hidden">
        {article2 ? (
          <ArticleSection article={article2} />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    </div>
  );
}
