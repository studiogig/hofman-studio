'use client';

import { useState, useEffect } from 'react';

type Category = 'all' | 'motion' | 'stills';
type MobileView = 'gallery' | 'info' | 'contact';

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
      { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video", isLandscape: true, vimeoId: "1154688609" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4", type: "video", isLandscape: true, vimeoId: "1154688545" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_094147.mp4", type: "video", isLandscape: true, vimeoId: "1154688574" },
      { src: "/videos/Wild rose/2026-01-07T21-52-22_luma_prompt__.mp4", type: "video", isLandscape: true, vimeoId: "1154688635" },
    ],
  },
  {
    id: 'merit',
    title: 'Merit Beauty',
    media: [
      { src: "/images/Merit/freepik__enhance__74134.jpg", type: "image", isLandscape: false },
      { src: "/images/Merit/SH_t9w9cp.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'gucci',
    title: 'Gucci Beauty',
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg", type: "image", isLandscape: false },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video", isLandscape: true, vimeoId: "1154689508" },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video", isLandscape: true, vimeoId: "1154689448" },
      { src: "/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4", type: "video", isLandscape: true, vimeoId: "1154688746" },
      { src: "/videos/Asbstracts/Professional_Mode_Camera_is_locked__A_transparent__4_chf3_prob4.mov", type: "video", isLandscape: true, vimeoId: "1154688698" },
    ],
  },
];

// Practice content - 4 sections
const METHODOLOGY_SECTIONS = [
  {
    title: 'We start with an idea. Not a tool.',
    content: `Every project begins with a concept, a product truth, and a visual direction. The method comes second.

Our background is still life and tabletop production. 15 years working with light, materials, motion, and control. That craft doesn't disappear in AI. It becomes the framework that guides it.

This isn't learned from tutorials. It's 15 years on set.`
  },
  {
    title: 'Concept, Then Movement',
    content: `Stills and motion aren't separate offerings. They're format choices.

A moment unfolding. A product revealed. An atmosphere built over time.

Sometimes that's a single frame. Sometimes it's motion. Often it's both. The language stays the same. Only the format changes.`
  },
  {
    title: 'Directed, Not Automated',
    content: `Nothing here is one-click. Nothing is left unattended.

Images and motion are shaped through reference, iteration, and adjustment. The same way a shoot evolves.

AI responds to direction. It doesn't replace it.`
  },
  {
    title: 'Craft at Speed',
    content: `AI is fast. That's not the hard part.

The hard part is fast work that doesn't look fast. Production that could have been shot but wasn't.

But speed isn't the point. It's the space to think properly. Concepts sketched, tested, rebuilt. Environments that never made sense to build. Combinations that wouldn't exist on a real set.

Not just generation. Direction. Not just speed. Craft and range.`
  }
];

// Images for splash flicker effect
const SPLASH_IMAGES = [
  "/images/Watch report/freepik__enhance__46843.jpg",
  "/images/Merit/freepik__enhance__74134.jpg",
  "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg",
  "/images/Watch report/freepik__enhance__73551.jpg",
  "/images/Merit/SH_t9w9cp.jpg",
];

export const MobileSite = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeView, setActiveView] = useState<MobileView>('gallery');
  const [expandedMedia, setExpandedMedia] = useState<MediaItem | null>(null);

  // Flicker through images then fade out
  useEffect(() => {
    // Flicker through images quickly
    const flickerInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % SPLASH_IMAGES.length);
    }, 150);

    // Stop flickering and start fade after 2 seconds
    const stopFlickerTimer = setTimeout(() => {
      clearInterval(flickerInterval);
      setSplashFading(true);
    }, 2000);

    // Hide splash completely
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearInterval(flickerInterval);
      clearTimeout(stopFlickerTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Filter projects based on category
  const filteredProjects = activeCategory === 'all'
    ? WORK_PROJECTS
    : WORK_PROJECTS.map(project => ({
        ...project,
        media: project.media.filter(item =>
          activeCategory === 'motion' ? item.type === 'video' : item.type === 'image'
        )
      })).filter(project => project.media.length > 0);

  // Flatten all media for grid display
  const allMedia = filteredProjects.flatMap(project =>
    project.media.map(item => ({ ...item, projectTitle: project.title }))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col">
      {/* Splash Screen with flickering images */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[200] bg-white dark:bg-[#1a1a1a] flex items-center justify-center transition-opacity duration-500 ${splashFading ? 'opacity-0' : 'opacity-100'}`}
        >
          {/* Flickering background image */}
          <img
            src={SPLASH_IMAGES[currentImageIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          {/* Studio name overlay */}
          <h1
            className="relative z-10 text-2xl tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Hofman Studio
          </h1>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] px-6 py-5 flex justify-between items-center border-b border-black/10 dark:border-white/10">
        <a href="/" className="text-xl font-calibre tracking-wide">
          Hofman Studio
        </a>
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveView('info')}
            className={`text-lg font-calibre transition-opacity py-2 ${activeView === 'info' ? 'opacity-100' : 'opacity-50'}`}
          >
            Practice
          </button>
          <button
            onClick={() => setActiveView('contact')}
            className={`text-lg font-calibre transition-opacity py-2 ${activeView === 'contact' ? 'opacity-100' : 'opacity-50'}`}
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24">
        {/* Gallery View */}
        {activeView === 'gallery' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {allMedia.map((item, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer overflow-hidden ${item.isLandscape ? 'col-span-2' : ''}`}
                  style={{ aspectRatio: item.isLandscape ? '16/9' : '3/4' }}
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
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info View - Practice */}
        {activeView === 'info' && (
          <div className="py-8 overflow-y-auto" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
            {METHODOLOGY_SECTIONS.map((section, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-xl mb-4 font-calibre">{section.title}</h2>
                <p className="text-base font-medium leading-relaxed opacity-80 whitespace-pre-line" style={{ fontFamily: 'Georgia, serif' }}>
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Contact View */}
        {activeView === 'contact' && (
          <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
            <a
              href="mailto:hello@hofman.studio"
              className="text-2xl mb-6 hover:opacity-50 transition-opacity py-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              hello@hofman.studio
            </a>
            <a
              href="https://instagram.com/hofman.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:opacity-50 transition-opacity py-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              @Hofman/studio
            </a>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Category Filters (only show in gallery view) */}
      {activeView === 'gallery' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] px-6 py-5 flex justify-center gap-8 border-t border-black/10 dark:border-white/10">
          {(['all', 'motion', 'stills'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg font-calibre transition-opacity py-2 px-1 ${activeCategory === category ? 'opacity-100' : 'opacity-50'}`}
            >
              {category === 'all' ? 'All' : category === 'motion' ? 'Motion' : 'Stills'}
            </button>
          ))}
        </nav>
      )}

      {/* Back button for info/contact views */}
      {activeView !== 'gallery' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] px-6 py-5 flex justify-center border-t border-black/10 dark:border-white/10">
          <button
            onClick={() => setActiveView('gallery')}
            className="text-lg font-calibre py-2"
          >
            Back to Work
          </button>
        </nav>
      )}

      {/* Expanded Media Overlay */}
      {expandedMedia && (
        <div
          className="fixed inset-0 z-[100] bg-white dark:bg-[#1a1a1a] flex items-center justify-center"
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
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          )}
          <button
            className="absolute top-5 right-5 text-4xl opacity-60 hover:opacity-100 transition-opacity p-2"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedMedia(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
