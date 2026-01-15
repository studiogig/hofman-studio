'use client';

type Category = 'all' | 'motion' | 'stills' | 'research';
type ViewMode = 'carousel' | 'grid';

// Minimal icons for view mode toggle
// Grid icon: 4 dots in a square pattern
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <circle cx="5" cy="5" r="2" />
    <circle cx="13" cy="5" r="2" />
    <circle cx="5" cy="13" r="2" />
    <circle cx="13" cy="13" r="2" />
  </svg>
);

// Carousel icon: 3 vertical lines
const CarouselIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="2" x2="4" y2="16" />
    <line x1="9" y1="2" x2="9" y2="16" />
    <line x1="14" y1="2" x2="14" y2="16" />
  </svg>
);

interface NavFooterProps {
  activeCategory?: Category;
  onCategoryChange?: (category: Category) => void;
  showInfoOverlay?: boolean;
  onInfoToggle?: () => void;
  showContactOverlay?: boolean;
  onContactToggle?: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export const NavFooter = ({
  activeCategory = 'all',
  onCategoryChange,
  showInfoOverlay = false,
  onInfoToggle,
  showContactOverlay = false,
  onContactToggle,
  viewMode = 'carousel',
  onViewModeChange
}: NavFooterProps) => {
  return (
    <footer className="fixed bottom-[50px] left-[150px] right-8 bg-white dark:bg-[#1a1a1a] py-4 flex justify-between items-center z-[150]">
      <a href="/" className="text-2xl md:text-3xl font-normal tracking-wide hover:opacity-50 transition-opacity-smooth">
        <span className="font-calibre">Hofman</span>
        <span className="font-calibre">/</span>
        <span style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>Studio</span>
      </a>

      <nav className="flex gap-6 items-center">
        {/* Category filters */}
        {onCategoryChange && (
          <>
            {(['all', 'motion', 'stills', 'research'] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className="relative text-lg font-normal font-calibre hover:opacity-50 transition-opacity-smooth"
              >
                {category === 'all' ? 'All' : category === 'motion' ? 'Motion' : category === 'stills' ? 'Stills' : 'Research'}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1px] bg-black dark:bg-white transition-all-smooth ${
                    activeCategory === category ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`}
                />
              </button>
            ))}
            <span className="text-black/20 dark:text-white/20">|</span>
          </>
        )}
        <button
          onClick={onInfoToggle}
          className="relative text-lg font-normal hover:opacity-50 transition-opacity-smooth font-calibre"
        >
          Practice
          <span
            className={`absolute bottom-0 left-0 right-0 h-[1px] bg-black dark:bg-white transition-all-smooth ${
              showInfoOverlay ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </button>
        <button
          onClick={onContactToggle}
          className="relative text-lg font-normal hover:opacity-50 transition-opacity-smooth font-calibre"
        >
          Contact
          <span
            className={`absolute bottom-0 left-0 right-0 h-[1px] bg-black dark:bg-white transition-all-smooth ${
              showContactOverlay ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
          />
        </button>
        {/* View mode toggle */}
        {onViewModeChange && (
          <>
            <span className="text-black/20 dark:text-white/20">|</span>
            <button
              onClick={() => onViewModeChange(viewMode === 'carousel' ? 'grid' : 'carousel')}
              className="hover:opacity-50 transition-opacity-smooth p-1"
              aria-label={viewMode === 'carousel' ? 'Switch to grid view' : 'Switch to carousel view'}
            >
              {viewMode === 'carousel' ? <GridIcon /> : <CarouselIcon />}
            </button>
          </>
        )}
      </nav>
    </footer>
  );
};
