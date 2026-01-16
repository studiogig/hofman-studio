'use client';

type InfoItem = {
  title: string;
  content: string;
  isEmail?: boolean;
};

type InfoSectionProps = {
  item: InfoItem;
};

// Single info section - identical layout for portrait OR each half of landscape
// Layout: title at top-left, content at bottom-left
export function InfoSection({ item }: InfoSectionProps) {
  return (
    <div
      className="flex flex-col justify-between w-full h-full"
      style={{ padding: 'var(--info-padding)' }}
    >
      {/* Title at top-left */}
      <h2
        className="font-bold uppercase tracking-tight leading-tight text-black dark:text-white"
        style={{
          fontFamily: 'Calibre, Arial, sans-serif',
          fontSize: 'var(--info-title-size)',
        }}
      >
        {item.title}
      </h2>

      {/* Content at bottom-left */}
      <div>
        {item.isEmail ? (
          <a
            href={`mailto:${item.content}`}
            className="hover:opacity-50 transition-opacity duration-300 text-black dark:text-white"
            style={{
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontStyle: 'italic',
              fontSize: 'var(--info-content-size)',
            }}
          >
            {item.content}
          </a>
        ) : (
          <p
            className="text-black dark:text-white"
            style={{
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 'var(--info-content-size)',
              lineHeight: '1.4',
            }}
          >
            {item.content.split('\n\n').map((para: string, i: number) => (
              <span key={i}>
                {i > 0 && <><br /><br /></>}
                {para}
              </span>
            ))}
          </p>
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
