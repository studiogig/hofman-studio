'use client';

import { useState, useEffect, useMemo } from 'react';

type Category = 'all' | 'research';
type MobileView = 'gallery' | 'research' | 'info' | 'contact';

type MediaItem = {
  src: string;
  type: 'image' | 'video';
  isLandscape?: boolean;
  vimeoId?: string;
};

type Project = {
  id: string;
  title: string;
  media: MediaItem[];
};

// Work projects - same data as desktop
const WORK_PROJECTS: Project[] = [
  {
    id: 'horlogerie',
    title: 'Horlogerie',
    media: [
      { src: "/images/Watch report/freepik__enhance__46843.jpg", type: "image", isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__73551.jpg", type: "image", isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__83979.jpg", type: "image", isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__83980.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'wild-rose',
    title: 'Wild Rose',
    media: [
      { src: "https://player.vimeo.com/progressive_redirect/playback/1157693117/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=6e4eb18541221cac1098afcefbe0b85477331b43046f40115b60adb962c573c7", type: "video", isLandscape: true, vimeoId: "1157693117" },
    ],
  },
  {
    id: 'merit',
    title: 'Merit Beauty',
    media: [
      { src: "/images/Merit/SH_Merti_s1.jpg", type: "image", isLandscape: false },
      { src: "/images/Merit/SH_Merti_S2.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'gucci',
    title: 'Gucci Beauty',
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s1.jpg", type: "image", isLandscape: false },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2_2.jpg", type: "image", isLandscape: false },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s3.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video", isLandscape: false, vimeoId: "1154689508" },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video", isLandscape: false, vimeoId: "1154689448" },
      { src: "/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4", type: "video", isLandscape: false, vimeoId: "1154688746" },
      // NOTE: .mov files don't work in browsers - convert to .mp4 to re-enable
      // { src: "/videos/Asbstracts/Professional_Mode_Camera_is_locked__A_transparent__4_chf3_prob4.mov", type: "video", isLandscape: false, vimeoId: "1154688698" },
    ],
  },
];

// Research projects - same as desktop
const RESEARCH_PROJECTS: Project[] = [
  {
    id: 'mer',
    title: 'Mer',
    media: [
      { src: "/images/Research/Mer/Emerald_and_diamond_cascade_necklace_pulled_beneath_rough_oce_58973739-9a66-4e86-a428-cd489d31f419_3.png", type: "image", isLandscape: false },
      { src: "/images/Research/Mer/Pearl_strand_necklace_with_citrine_pendant_on_dark_ocean_surf_62c04ef5-74b6-42df-aedc-6cccf43b5296_2.png", type: "image", isLandscape: false },
      { src: "/images/Research/Mer/Rose_gold_serpent_necklace_caught_in_rough_dark_ocean_chop_di_a0ca4b1f-1916-4221-8c6b-75bd65be6060_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Mer/White_gold_geometric_necklace_with_blue_sapphires_submerged_i_24f01563-2473-4418-a7d0-538bdf69fb96_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Mer/White_gold_geometric_necklace_with_blue_sapphires_submerged_i_d844512e-109f-4925-bb5d-3c3e0457064d_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Mer/White_gold_statement_necklace_with_radiating_diamond_fringe_c_2f92adca-b6ef-44ea-8fc9-b88952eeb375_3.png", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'fork',
    title: 'Fork',
    media: [
      { src: "/images/Research/Fork/Studio_Gig_httpss.mj.runiL30C6W1slw_A_hyperreal_macro_photogr_94133535-ee2e-47ec-a622-51e607854694_3.png", type: "image", isLandscape: false },
      { src: "/images/Research/Fork/Studio_Gig_httpss.mj.runiL30C6W1slw_A_hyperreal_macro_photograp_5b5fb539-4501-49ca-9526-9fabf10f2bcc.png", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'liquids',
    title: 'Liquids',
    media: [
      { src: "/images/Research/Liquids/Studio_Gig_A_hyper-detailed_macro_photograph_of_clear_and_mil_c9f41145-c091-49dd-ad31-6a596befe070_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Liquids/Studio_Gig_A_hyper-detailed_macro_photograph_of_clear_and_milky_8ee222c4-44ed-4050-b8ea-244b4604b275.png", type: "image", isLandscape: false },
      { src: "/images/Research/Liquids/Studio_Gig_A_macro_photograph_of_poured_and_smeared_gel-like__d46a86a7-7064-405d-b1fb-8a4629bcb8c3_0.png", type: "image", isLandscape: false },
      { src: "/images/Research/Liquids/Studio_Gig_A_macro_photograph_of_poured_and_smeared_gel-like_li_d30b057f-c112-4c4e-86b5-a611e0b39adc.png", type: "image", isLandscape: false },
      { src: "/images/Research/Liquids/Studio_Gig_Black_ink_oil_and_acrylic_paint_on_a_white_backgro_e75a78f3-9ddc-4323-a085-4dbead706d05_2.png", type: "image", isLandscape: false },
      { src: "/images/Research/Liquids/Studio_Gig_httpss.mj.runu7vJxw1WJjQ_A_hyper-detailed_macro_ph_8be03e22-6a07-4530-80f8-0533fd5f3057_0.png", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'rose',
    title: 'Rose',
    media: [
      { src: "/images/Research/Rose/Extreme_macro_where_white_petal_kisses_amber_oil_surface_tens_a53bcbf6-e787-4ca1-836b-3218f8d8160a_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Rose/Wild_white_rose_with_golden_stamens_soft_cream_background_bri_485f94b2-2313-4f90-ab2a-cf14fd37882e_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Rose/wild_white_rose_in_soft_cream_void_golden_stamens_tiny_bead_o_b3210fbb-03f1-41cb-8224-a892473f6bc8_3.png", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'submerged',
    title: 'Submerged',
    media: [
      { src: "/images/Research/Submerged/Studio_Gig_A_macro_image_of_a_soft_blue_iris_flower_immersed__cf107d4a-0a7b-4d9d-828d-677656c621d1_1.png", type: "image", isLandscape: false },
      { src: "/images/Research/Submerged/Studio_Gig_A_macro_image_of_a_soft_blue_iris_flower_immersed_in_4fd7d986-48a0-4f48-ac55-07488ac99f21.png", type: "image", isLandscape: false },
      { src: "/images/Research/Submerged/Studio_Gig_A_macro_image_of_a_soft_white_iris_flower_immersed_29d38bfb-f42a-4535-ad52-eb297bee9303_3.png", type: "image", isLandscape: false },
      { src: "/images/Research/Submerged/Studio_Gig_A_macro_image_of_a_soft_white_iris_flower_immersed_a31e50ff-8e35-4c5e-ad38-b9a3686b2192_3.png", type: "image", isLandscape: false },
    ],
  },
];

// Info content (matching desktop - 3 slides)
const INFO_SECTIONS = [
  {
    title: 'What we make',
    content: 'AI product photography and motion for luxury brands. Campaign imagery. Commercial photography. Editorial. Social content. Motion for digital. A London-based AI photography studio for beauty, spirits, fragrance, and fine goods.'
  },
  {
    title: 'What we bring',
    content: 'Fifteen years of lighting glass, liquid, and metal. We know how light bends through crystal. How it pools across liquid. How it catches on gold. That knowledge shapes every frame.'
  },
  {
    title: 'How we work',
    content: 'Brief to delivery in days, not weeks. You\'re working with a director, not a software interface. Concepts, revisions, final assets. Same creative process, collapsed timeline.'
  }
];

// Images for splash flicker effect
const SPLASH_IMAGES = [
  "/images/Merit/SH_Merti_s1.jpg",
  "/images/Gucci Chrome absurdist/SH_Gucci_Master s1.jpg",
  "/images/Watch report/freepik__enhance__73551.jpg",
  "/images/Merit/SH_Merti_S2.jpg",
];

export const MobileSite = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeView, setActiveView] = useState<MobileView>('gallery');
  const [expandedMedia, setExpandedMedia] = useState<MediaItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Flicker through images then fade out
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % SPLASH_IMAGES.length);
    }, 150);

    const stopFlickerTimer = setTimeout(() => {
      clearInterval(flickerInterval);
      setSplashFading(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearInterval(flickerInterval);
      clearTimeout(stopFlickerTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Shuffle projects on each mount so gallery order is different every visit
  const shuffledWork = useMemo(() => [...WORK_PROJECTS].sort(() => Math.random() - 0.5), []);
  const shuffledResearch = useMemo(() => [...RESEARCH_PROJECTS].sort(() => Math.random() - 0.5), []);

  // Get projects based on active view
  const currentProjects = activeView === 'research' ? shuffledResearch : shuffledWork;

  // Menu items with numbered indices (Studio Terrace style)
  const MENU_ITEMS: { label: string; view?: MobileView; href?: string }[] = [
    { label: 'Work', view: 'gallery' },
    { label: 'Research', view: 'research' },
    { label: 'Info', view: 'info' },
    { label: 'Writing', href: 'https://medium.com/@samhofman' },
    { label: 'Contact', view: 'contact' },
    { label: 'Instagram', href: 'https://instagram.com/hofman.studio' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/samhofman' },
  ];

  // Render a media item (shared between gallery views)
  const renderMediaItem = (item: MediaItem, idx: number, size: 'hero' | 'thumb') => {
    const isHero = size === 'hero';
    return (
      <div
        key={idx}
        className={`relative cursor-pointer overflow-hidden ${item.isLandscape && !isHero ? 'col-span-2' : ''}`}
        style={{ aspectRatio: '9/16' }}
        onClick={() => setExpandedMedia(item)}
      >
        {item.type === 'video' ? (
          item.vimeoId && process.env.NODE_ENV === 'production' ? (
            <iframe
              src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <video
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <img
            src={item.src}
            alt={`${item.type === 'image' ? 'AI product photography' : 'AI motion'} — Hofman Studio`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  };

  // Render a project block — all images full size, stacked
  const renderProjectBlock = (project: Project) => {
    return (
      <div key={project.id} className="mb-8 last:mb-0">
        {/* Project title */}
        <div className="px-5 mb-3 flex items-baseline justify-between">
          <h2
            className="text-xs tracking-[0.2em] uppercase text-black/40 dark:text-white/40"
            style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500 }}
          >
            {project.title}
          </h2>
          <span
            className="text-xs text-black/25 dark:text-white/25"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            {String(project.media.length).padStart(2, '0')}
          </span>
        </div>

        {/* All images full width, stacked */}
        <div className="px-5 space-y-1">
          {project.media.map((item, idx) => renderMediaItem(item, idx, 'hero'))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Splash Screen with flickering images */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[200] bg-white dark:bg-[#1a1a1a] flex items-center justify-center transition-opacity duration-500 ${splashFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <img
            src={SPLASH_IMAGES[currentImageIndex]}
            alt="Hofman Studio — AI luxury production"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <h1 className="relative z-10 tracking-wide" style={{ fontSize: '3.5rem' }}>
            <span style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500 }}>Hofman</span>
            <span style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500 }}> / </span>
            <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 }}>Studio</span>
          </h1>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm px-5 py-5 flex justify-between items-center">
        <button
          onClick={() => { setActiveView('gallery'); setMenuOpen(false); }}
          className="tracking-wide"
          style={{ fontSize: '1.75rem' }}
        >
          <span style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500 }}>Hofman</span>
          <span style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500 }}> / </span>
          <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 }}>Studio</span>
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="tracking-[0.15em] uppercase transition-opacity hover:opacity-50"
          style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500, fontSize: '1.25rem' }}
          aria-label="Menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Menu Overlay — Studio Terrace style */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-[#1a1a1a] flex flex-col transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Menu content — vertically centered */}
        <nav className="flex-1 flex flex-col justify-center" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          {MENU_ITEMS.map((item, index) => {
            const isActive = item.view && activeView === item.view;
            const number = String(index + 1).padStart(2, '0');

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-baseline justify-between py-5  transition-opacity hover:opacity-60"
                  onClick={() => setMenuOpen(false)}
                >
                  <span
                    className="text-black dark:text-white"
                    style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500, fontSize: '2.5rem' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-black/30 dark:text-white/30"
                    style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.5rem' }}
                  >
                    {number}
                  </span>
                </a>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => { if (item.view) setActiveView(item.view); setMenuOpen(false); }}
                className={`flex items-baseline justify-between py-5  text-left transition-opacity ${isActive ? 'opacity-100' : 'opacity-100 hover:opacity-60'}`}
              >
                <span
                  className="text-black dark:text-white"
                  style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500, fontSize: '2.5rem' }}
                >
                  {item.label}
                </span>
                <span
                  className="text-black/30 dark:text-white/30"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.5rem' }}
                >
                  {number}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-0 overflow-y-auto">
        {/* Gallery View (Work) — Editorial layout */}
        {activeView === 'gallery' && (
          <div className="pt-4">
            {currentProjects.map(renderProjectBlock)}
          </div>
        )}

        {/* Research View — Same editorial layout */}
        {activeView === 'research' && (
          <div className="pt-4">
            {RESEARCH_PROJECTS.map(renderProjectBlock)}
          </div>
        )}

        {/* Info View — each section fills ~screen height for 9:16 feel */}
        {activeView === 'info' && (
          <div className="px-8">
            {INFO_SECTIONS.map((section, index) => (
              <section key={index} className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: 'calc(60svh)' }}>
                {/* Section number */}
                <span
                  className="text-black/20 dark:text-white/20 block mb-6"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Title - Calibre */}
                <h2
                  className="text-black dark:text-white mb-8"
                  style={{
                    fontFamily: 'Calibre, Arial, sans-serif',
                    fontSize: '1.75rem',
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  {section.title}
                </h2>

                {/* Content - Serif, flowing */}
                <p
                  className="text-black/55 dark:text-white/55 max-w-[28ch]"
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '1.35rem',
                    lineHeight: 1.7,
                  }}
                >
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Contact View — centred in 9:16 viewport */}
        {activeView === 'contact' && (
          <div className="px-8 flex flex-col items-center text-center" style={{ minHeight: 'calc(100svh - 4rem)' }}>
            <div className="px-4 max-w-[30ch] flex-1 flex flex-col items-center justify-center">
              {/* Bio - Calibre */}
              <p
                className="text-black dark:text-white mb-14"
                style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500, fontSize: '1.75rem', lineHeight: 1.3 }}
              >
                AI-directed production. Luxury stills and motion. Built on 15 years of tabletop craft. London.
              </p>

              {/* Contact links */}
              <div className="space-y-7">
                <a
                  href="mailto:sam@hofman.studio"
                  className="block hover:opacity-50 transition-opacity text-black dark:text-white"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, fontSize: '1.5rem' }}
                >
                  sam@hofman.studio
                </a>
                <a
                  href="https://www.instagram.com/hofman.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-50 transition-opacity text-black/70 dark:text-white/70"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' }}
                >
                  @hofman.studio
                </a>
                <a
                  href="https://linkedin.com/in/samhofman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-50 transition-opacity text-black/70 dark:text-white/70"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' }}
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Traditional photography — pinned to bottom */}
            <div className="pb-8">
              <p
                className="text-sm tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-3"
                style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
              >
                Traditional photography and film
              </p>
              <a
                href="https://www.samhofman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-50 transition-opacity text-black/70 dark:text-white/70"
                style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem' }}
              >
                samhofman.com
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Expanded Media Overlay */}
      {expandedMedia && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setExpandedMedia(null)}
        >
          {expandedMedia.type === 'video' ? (
            expandedMedia.vimeoId && process.env.NODE_ENV === 'production' ? (
              <iframe
                src={`https://player.vimeo.com/video/${expandedMedia.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                className="w-full max-h-full aspect-video border-0"
                allow="autoplay; fullscreen"
              />
            ) : (
              <video
                src={expandedMedia.src}
                autoPlay
                loop
                muted
                playsInline
                className="max-w-full max-h-full object-contain"
              />
            )
          ) : (
            <img
              src={expandedMedia.src}
              alt="Hofman Studio — expanded portfolio image"
              className="max-w-full max-h-full object-contain"
            />
          )}
          <button
            className="absolute top-5 right-5 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors p-2"
            style={{ fontFamily: 'Calibre, Arial, sans-serif', fontWeight: 500 }}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedMedia(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
