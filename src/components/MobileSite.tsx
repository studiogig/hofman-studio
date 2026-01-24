'use client';

import { useState, useEffect } from 'react';

type Category = 'all' | 'research';
type MobileView = 'gallery' | 'research' | 'practice' | 'contact';

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

// Practice content - 4 simple statements (matching desktop)
const PRACTICE_SECTIONS = [
  {
    title: '15 years in still life and tabletop.',
    content: 'Light, materials, motion, control.'
  },
  {
    title: 'Now with new tools.',
    content: 'Same eye. Different process.'
  },
  {
    title: 'Direction first. Tools second.',
    content: 'Nothing here is one-click.'
  },
  {
    title: 'Craft remains.',
    content: 'The standard doesn\'t change.'
  }
];

// Images for splash flicker effect
const SPLASH_IMAGES = [
  "/images/Watch report/freepik__enhance__46843.jpg",
  "/images/Merit/SH_Merti_s1.jpg",
  "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg",
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

  // Get media based on active view
  const currentProjects = activeView === 'research' ? RESEARCH_PROJECTS : WORK_PROJECTS;
  const allMedia = currentProjects.flatMap(project =>
    project.media.map(item => ({ ...item, projectTitle: project.title }))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Splash Screen with flickering images */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[200] bg-white dark:bg-[#1a1a1a] flex items-center justify-center transition-opacity duration-500 ${splashFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <img
            src={SPLASH_IMAGES[currentImageIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <h1 className="relative z-10 text-2xl tracking-wide">
            <span className="font-calibre">Hofman</span>
            <span className="font-calibre">/</span>
            <span style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>Studio</span>
          </h1>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] px-5 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10">
        <button
          onClick={() => { setActiveView('gallery'); setMenuOpen(false); }}
          className="text-lg tracking-wide"
        >
          <span className="font-calibre">Hofman</span>
          <span className="font-calibre">/</span>
          <span style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>Studio</span>
        </button>
        {/* Hamburger menu icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white dark:bg-[#1a1a1a] pt-20 px-6 transition-opacity duration-300"
          style={{ opacity: menuOpen ? 1 : 0 }}
        >
          <nav className="flex flex-col gap-8 pt-10">
            <button
              onClick={() => { setActiveView('gallery'); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'gallery' ? 'opacity-100' : 'opacity-50'}`}
            >
              Work
            </button>
            <button
              onClick={() => { setActiveView('research'); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'research' ? 'opacity-100' : 'opacity-50'}`}
            >
              Research
            </button>
            <div className="w-8 h-px bg-black/20 dark:bg-white/20" />
            <button
              onClick={() => { setActiveView('practice'); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'practice' ? 'opacity-100' : 'opacity-50'}`}
            >
              Practice
            </button>
            <a
              href="https://medium.com/@samhofman"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-calibre text-left opacity-50 hover:opacity-100 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              Writing
            </a>
            <button
              onClick={() => { setActiveView('contact'); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'contact' ? 'opacity-100' : 'opacity-50'}`}
            >
              Contact
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-10 overflow-y-auto">
        {/* Gallery View (Work) */}
        {activeView === 'gallery' && (
          <div className="p-3">
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

        {/* Research View */}
        {activeView === 'research' && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {RESEARCH_PROJECTS.flatMap(project =>
                project.media.map((item, idx) => ({ ...item, projectTitle: project.title, key: `${project.id}-${idx}` }))
              ).map((item) => (
                <div
                  key={item.key}
                  className={`relative cursor-pointer overflow-hidden ${item.isLandscape ? 'col-span-2' : ''}`}
                  style={{ aspectRatio: item.isLandscape ? '16/9' : '3/4' }}
                  onClick={() => setExpandedMedia(item)}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice View */}
        {activeView === 'practice' && (
          <div className="px-6 py-8">
            {PRACTICE_SECTIONS.map((section, index) => (
              <section key={index} className="mb-16 last:mb-0">
                <h2
                  className="text-lg font-bold uppercase tracking-tight mb-4 font-calibre"
                  style={{ lineHeight: 1.2 }}
                >
                  {section.title}
                </h2>
                <p
                  className="text-base opacity-80"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* Contact View */}
        {activeView === 'contact' && (
          <div className="px-6 flex flex-col items-center justify-center min-h-[60vh]">
            <a
              href="mailto:hello@hofman.studio"
              className="text-xl mb-6 hover:opacity-50 transition-opacity"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              hello@hofman.studio
            </a>
            <a
              href="https://instagram.com/hofman.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:opacity-50 transition-opacity"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              @Hofman/studio
            </a>
          </div>
        )}
      </main>

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
            className="absolute top-4 right-4 text-3xl opacity-60 hover:opacity-100 transition-opacity p-2"
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
