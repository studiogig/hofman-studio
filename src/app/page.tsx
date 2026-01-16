'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { IntroSplash } from '@/components/IntroSplash';
import { NavFooter } from '@/components/NavFooter';
import { MobileSite } from '@/components/MobileSite';
import { InfoOverlay } from '@/components/InfoSection';
import { useIsMobile } from '@/lib/useIsMobile';

type Category = 'all' | 'motion' | 'stills' | 'research';
type ViewMode = 'carousel' | 'grid';

type MediaItem = {
  src: string;
  type: 'image' | 'video';
  isLandscape?: boolean; // true = 16:9 landscape frame, false/undefined = 4:5 portrait frame
  vimeoId?: string; // Vimeo video ID for production streaming
  process?: string; // Process tag: "In-Camera", "AI Still", "AI Motion", "Iterative Render", etc.
};

type Project = {
  id: string;
  title: string;
  media: MediaItem[];
  priority?: number; // Higher number = shown first, undefined = random order after priority items
};

type InfoItem = { title: string; content: string; isEmail?: boolean };

// Methodology content to display in frames (4 sections)
const INFO_CONTENT: InfoItem[] = [
  { title: 'We start with an idea. Not a tool.', content: 'Every project begins with a concept, a product truth, and a visual direction. The method comes second.\n\nOur background is still life and tabletop production. 15 years working with light, materials, motion, and control. That craft doesn\'t disappear in AI. It becomes the framework that guides it.\n\nThis isn\'t learned from tutorials. It\'s 15 years on set.' },
  { title: 'Concept, Then Movement', content: 'Stills and motion aren\'t separate offerings. They\'re format choices.\n\nA moment unfolding. A product revealed. An atmosphere built over time.\n\nSometimes that\'s a single frame. Sometimes it\'s motion. Often it\'s both. The language stays the same. Only the format changes.' },
  { title: 'Directed, Not Automated', content: 'Nothing here is one-click. Nothing is left unattended.\n\nImages and motion are shaped through reference, iteration, and adjustment. The same way a shoot evolves.\n\nAI responds to direction. It doesn\'t replace it.' },
  { title: 'Craft at Speed', content: 'AI is fast. That\'s not the hard part.\n\nThe hard part is fast work that doesn\'t look fast. Production that could have been shot but wasn\'t.\n\nBut speed isn\'t the point. It\'s the space to think properly. Concepts sketched, tested, rebuilt. Environments that never made sense to build. Combinations that wouldn\'t exist on a real set.\n\nNot just generation. Direction. Not just speed. Craft and range.' },
];

// Contact content for single frame
const CONTACT_CONTENT = {
  title: 'Contact',
  email: 'hello@hofman.studio',
  instagram: '@Hofman/studio'
};

// Work projects with grouped media
// isLandscape: true for 16:9 aspect ratio, false/undefined for 3:4 portrait
const WORK_PROJECTS: Project[] = [
  {
    id: 'horlogerie',
    title: 'Horlogerie',
    media: [
      { src: "/images/Watch report/freepik__enhance__46843.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
      { src: "/images/Watch report/freepik__enhance__73551.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
      { src: "/images/Watch report/freepik__enhance__83979.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
      { src: "/images/Watch report/freepik__enhance__83980.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
    ],
  },
  {
    id: 'wild-rose',
    title: 'Wild Rose',
    media: [
      { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688609", process: "AI Motion" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688545", process: "AI Motion" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_094147.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688574", process: "AI Motion" },
      { src: "/videos/Wild rose/2026-01-07T21-52-22_luma_prompt__.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688635", process: "AI Motion" },
    ],
  },
  {
    id: 'merit',
    title: 'Merit Beauty',
    media: [
      { src: "/images/Merit/freepik__enhance__74134.jpg", type: "image" as const, isLandscape: false, process: "Iterative Render" },
      { src: "/images/Merit/SH_t9w9cp.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
    ],
  },
  {
    id: 'gucci',
    title: 'Gucci Beauty',
    priority: 1, // Featured project - appears first
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg", type: "image" as const, isLandscape: false, process: "Iterative Render" },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video", isLandscape: false, vimeoId: "1154689508", process: "AI Motion" },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video", isLandscape: false, vimeoId: "1154689448", process: "AI Motion" },
      { src: "/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4", type: "video", isLandscape: false, vimeoId: "1154688746", process: "AI Motion" },
      // NOTE: .mov files don't work in browsers - convert to .mp4 to re-enable
      // { src: "/videos/Asbstracts/Professional_Mode_Camera_is_locked__A_transparent__4_chf3_prob4.mov", type: "video", isLandscape: false, vimeoId: "1154688698", process: "AI Motion" },
    ],
  },
];

// Shuffle array with a seed (consistent per session)
const shuffleArray = <T,>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  // Simple seeded random
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex > 0) {
    const randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
};

// Sort projects: priority items first (by priority desc), then shuffle the rest
const getOrderedProjects = (projects: typeof WORK_PROJECTS, seed: number) => {
  const priorityProjects = projects
    .filter(p => p.priority !== undefined)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const nonPriorityProjects = projects.filter(p => p.priority === undefined);
  const shuffledNonPriority = shuffleArray(nonPriorityProjects, seed);

  return [...priorityProjects, ...shuffledNonPriority];
};

// Research projects - separate content for research tab
// Add your research images/videos here
const RESEARCH_PROJECTS: Project[] = [
  // Example structure - add your research content here:
  // {
  //   id: 'material-study',
  //   title: 'Material Study',
  //   media: [
  //     { src: "/images/research/study1.jpg", type: "image", isLandscape: false },
  //   ],
  // },
];

export default function Home() {
  const { isMobile, isLoaded } = useIsMobile();
  const [showIntro, setShowIntro] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [visibleFrameIndices, setVisibleFrameIndices] = useState<number[]>([]);
  const [contactFrameIndex, setContactFrameIndex] = useState<number | null>(null);
  const [expandedMedia, setExpandedMedia] = useState<{
    item: MediaItem;
    projectTitle: string;
    globalIndex: number;
  } | null>(null);
  const [returnToGrid, setReturnToGrid] = useState(false); // Track if we should return to grid after closing info/contact
  const [isTransitioning, setIsTransitioning] = useState(false); // Track view mode transition
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const animationRef = useRef<number | null>(null);

  // Generate a random seed once per session for consistent ordering
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 10000));

  // Get randomized projects with priority items first
  const orderedProjects = useMemo(() => getOrderedProjects(WORK_PROJECTS, sessionSeed), [sessionSeed]);

  // Filter projects based on category (uses randomized order)
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'research') return RESEARCH_PROJECTS;
    if (activeCategory === 'all') return orderedProjects;

    return orderedProjects.map(project => ({
      ...project,
      media: project.media.filter(item =>
        activeCategory === 'motion' ? item.type === 'video' : item.type === 'image'
      )
    })).filter(project => project.media.length > 0);
  }, [activeCategory, orderedProjects]);

  // Reset scroll position when category changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);

  // Handle category change - close info/contact and change category
  const handleCategoryChange = (category: Category) => {
    if (showInfo) setShowInfo(false);
    if (showContact) setShowContact(false);
    setActiveCategory(category);
  };

  // Handle view mode change - close info/contact and crossfade when switching views
  const handleViewModeChange = (mode: ViewMode) => {
    if (showInfo) setShowInfo(false);
    if (showContact) setShowContact(false);
    // Trigger crossfade transition
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      // Use requestAnimationFrame for smoother paint timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      });
    }, 600); // Duration matches CSS transition-opacity-smooth
  };

  // Get all media items flattened with their global indices (uses randomized order)
  const allMediaItems = useMemo(() => {
    const items: { globalIndex: number; isLandscape: boolean }[] = [];
    let index = 0;
    orderedProjects.forEach(project => {
      project.media.forEach(item => {
        items.push({ globalIndex: index, isLandscape: item.isLandscape || false });
        index++;
      });
    });
    return items;
  }, [orderedProjects]);

  // Helper to get frame indices for info display
  // Select frames to cover all info sections (landscape = 2 sections, portrait = 1)
  const getFrameIndicesForInfoCount = (infoCount: number): number[] => {
    if (allMediaItems.length === 0) return [0, 1, 2, 3].slice(0, infoCount);

    const framesToUse: number[] = [];
    let sectionsUsed = 0;

    // Go through media items in order, adding frames until we have enough sections
    for (const mediaItem of allMediaItems) {
      if (sectionsUsed >= infoCount) break;
      framesToUse.push(mediaItem.globalIndex);
      sectionsUsed += mediaItem.isLandscape ? 2 : 1;
    }

    return framesToUse;
  };

  // Function to detect visible frames and toggle info mode
  const handleInfoToggle = () => {
    if (!showInfo) {
      // Close contact if open (mutually exclusive)
      if (showContact) {
        setShowContact(false);
      }
      // If in grid mode, crossfade to carousel and mark to return
      if (viewMode === 'grid') {
        setReturnToGrid(true);
        setIsTransitioning(true);
        // Use random frames for info display when coming from grid
        setVisibleFrameIndices(getFrameIndicesForInfoCount(INFO_CONTENT.length));
        setTimeout(() => {
          setViewMode('carousel');
          setShowInfo(true);
          // Reset scroll to 0 so content starts at left edge (no extra padding)
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
          }
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        // In carousel mode, select the most CENTRAL visible frames for info overlay
        // Portrait frames show 1 section, landscape frames show 2 sections
        const container = scrollContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;

          // Find all visible frames with their distance from center
          const visibleFrames: { index: number; isLandscape: boolean; distanceFromCenter: number }[] = [];

          frameRefs.current.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const mediaItem = allMediaItems.find(m => m.globalIndex === index);
            // Check if frame is at least partially visible
            if (rect.right > containerRect.left && rect.left < containerRect.right) {
              const frameCenter = rect.left + rect.width / 2;
              visibleFrames.push({
                index,
                isLandscape: mediaItem?.isLandscape || false,
                distanceFromCenter: Math.abs(frameCenter - containerCenter)
              });
            }
          });

          // Sort by distance from center (most central first)
          visibleFrames.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);

          // Select frames starting from center until we have enough sections
          const framesToUse: number[] = [];
          let sectionsUsed = 0;

          for (const frame of visibleFrames) {
            if (sectionsUsed >= INFO_CONTENT.length) break;
            framesToUse.push(frame.index);
            sectionsUsed += frame.isLandscape ? 2 : 1;
          }

          // If we don't have enough visible frames, add adjacent frames
          if (sectionsUsed < INFO_CONTENT.length) {
            const allFrameIndices = allMediaItems.map(m => ({ index: m.globalIndex, isLandscape: m.isLandscape }));
            const usedIndices = new Set(framesToUse);

            // Get the range of used frames
            const minUsed = Math.min(...framesToUse);
            const maxUsed = Math.max(...framesToUse);

            // Alternate between adding frames after and before
            let addAfter = true;
            while (sectionsUsed < INFO_CONTENT.length) {
              const nextAfter = allFrameIndices.find(f => f.index > maxUsed && !usedIndices.has(f.index));
              const nextBefore = [...allFrameIndices].reverse().find(f => f.index < minUsed && !usedIndices.has(f.index));

              const frameToAdd = addAfter ? (nextAfter || nextBefore) : (nextBefore || nextAfter);
              if (!frameToAdd) break;

              framesToUse.push(frameToAdd.index);
              usedIndices.add(frameToAdd.index);
              sectionsUsed += frameToAdd.isLandscape ? 2 : 1;
              addAfter = !addAfter;
            }
          }

          // Sort final list by index for consistent display order
          framesToUse.sort((a, b) => a - b);
          setVisibleFrameIndices(framesToUse);
        }
        setShowInfo(true);
      }
    } else {
      // Closing info - return to grid if we came from there
      if (returnToGrid) {
        setIsTransitioning(true);
        setShowInfo(false);
        setTimeout(() => {
          setReturnToGrid(false);
          setViewMode('grid');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        setShowInfo(false);
      }
    }
  };

  // Function to detect most central visible frame and toggle contact mode
  const handleContactToggle = () => {
    if (!showContact) {
      // Close info if open (mutually exclusive)
      if (showInfo) {
        setShowInfo(false);
      }
      // If in grid mode, crossfade to carousel and mark to return
      if (viewMode === 'grid') {
        setReturnToGrid(true);
        setIsTransitioning(true);
        // Use first frame for contact display when coming from grid
        setContactFrameIndex(0);
        setTimeout(() => {
          setViewMode('carousel');
          setShowContact(true);
          // Reset scroll to 0 so content starts at left edge (no extra padding)
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
          }
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        // Capture the most central visible frame BEFORE toggling contact on
        const container = scrollContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;
          let closestIndex: number | null = null;
          let closestDistance = Infinity;

          frameRefs.current.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            // Check if frame is at least partially visible
            if (rect.right > containerRect.left && rect.left < containerRect.right) {
              // Calculate distance from frame center to container center
              const frameCenter = rect.left + rect.width / 2;
              const distance = Math.abs(frameCenter - containerCenter);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
              }
            }
          });

          setContactFrameIndex(closestIndex);

          // Animate scroll to center the frame
          if (closestIndex !== null) {
            const element = frameRefs.current.get(closestIndex);
            if (element) {
              const frameRect = element.getBoundingClientRect();
              const frameCenter = frameRect.left + frameRect.width / 2;
              const scrollOffset = frameCenter - containerCenter;
              container.scrollTo({
                left: container.scrollLeft + scrollOffset,
                behavior: 'smooth'
              });
            }
          }
        }
        setShowContact(true);
      }
    } else {
      // Closing contact - return to grid if we came from there
      if (returnToGrid) {
        setIsTransitioning(true);
        setShowContact(false);
        setTimeout(() => {
          setReturnToGrid(false);
          setViewMode('grid');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        setShowContact(false);
      }
    }
  };

  // Lock scroll when expanded
  useEffect(() => {
    if (expandedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expandedMedia]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!expandedMedia) return;

    const allFlatMedia = filteredProjects.flatMap(project =>
      project.media.map(item => ({ item, projectTitle: project.title }))
    );
    const currentIndex = expandedMedia.globalIndex;
    const totalItems = allFlatMedia.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedMedia(null);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        const prev = allFlatMedia[prevIndex];
        setExpandedMedia({ item: prev.item, projectTitle: prev.projectTitle, globalIndex: prevIndex });
      } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
        const nextIndex = currentIndex + 1;
        const next = allFlatMedia[nextIndex];
        setExpandedMedia({ item: next.item, projectTitle: next.projectTitle, globalIndex: nextIndex });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedMedia, filteredProjects]);

  // Mouse position scroll effect (for carousel and grid)
  useEffect(() => {
    // Don't scroll when intro is showing or contact is active
    if (showIntro) return;
    if (showContact) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollSpeed = 0;
    const baseSpeed = 6;
    const edgeSpeed = 15; // Faster speed at extreme edges
    const menuHeight = 150; // Height from bottom where menu is (bottom-[50px] + some padding)

    // Function to calculate max scroll for info mode dynamically
    const getMaxScroll = (): number => {
      if (!showInfo || visibleFrameIndices.length === 0) return Infinity;

      const lastInfoIndex = visibleFrameIndices[visibleFrameIndices.length - 1];
      const lastFrame = frameRefs.current.get(lastInfoIndex);
      if (!lastFrame) return Infinity;

      // Max scroll is when the last info frame reaches the right edge of the viewport
      const containerRect = container.getBoundingClientRect();
      const frameRect = lastFrame.getBoundingClientRect();
      const currentScroll = container.scrollLeft;
      // Allow scrolling until the right edge of the last frame aligns with viewport right
      return currentScroll + (frameRect.right - containerRect.right) + 50; // 50px padding
    };

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const centerZone = 0.3; // 30% in the center = no scroll
      const edgeZone = 0.1; // 10% at extreme edges = faster scroll

      // Don't scroll if mouse is near the bottom (over the menu)
      if (mouseY > windowHeight - menuHeight) {
        scrollSpeed = 0;
        return;
      }

      const relativeX = mouseX / windowWidth;

      if (relativeX < edgeZone) {
        // Extreme left edge - fast scroll left
        const intensity = 1 - (relativeX / edgeZone);
        scrollSpeed = -edgeSpeed * intensity - baseSpeed;
      } else if (relativeX < (0.5 - centerZone / 2)) {
        // Left side - normal scroll left
        const intensity = 1 - ((relativeX - edgeZone) / (0.5 - centerZone / 2 - edgeZone));
        scrollSpeed = -baseSpeed * intensity;
      } else if (relativeX > (1 - edgeZone)) {
        // Extreme right edge - fast scroll right
        const intensity = (relativeX - (1 - edgeZone)) / edgeZone;
        scrollSpeed = edgeSpeed * intensity + baseSpeed;
      } else if (relativeX > (0.5 + centerZone / 2)) {
        // Right side - normal scroll right
        const intensity = (relativeX - (0.5 + centerZone / 2)) / (0.5 - centerZone / 2 - edgeZone);
        scrollSpeed = baseSpeed * Math.min(intensity, 1);
      } else {
        // Center zone - no scroll
        scrollSpeed = 0;
      }
    };

    const handleMouseLeave = () => {
      // Stop scrolling when mouse leaves the page
      scrollSpeed = 0;
    };

    const animate = () => {
      if (scrollSpeed !== 0 && container) {
        const newScroll = container.scrollLeft + scrollSpeed;
        // In info mode, limit scroll to not go past the last info frame
        if (showInfo) {
          const maxScroll = getMaxScroll();
          container.scrollLeft = Math.max(0, Math.min(newScroll, maxScroll));
        } else {
          container.scrollLeft = newScroll;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showIntro, showContact, showInfo, viewMode, visibleFrameIndices]);

  // Show mobile site on small screens, loading state while detecting
  if (!isLoaded) {
    return <div className="w-full h-screen bg-white dark:bg-[#1a1a1a]" />;
  }

  if (isMobile) {
    return <MobileSite />;
  }

  return (
    <>
      {/* Intro Splash */}
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}

      {/* Main Gallery */}
      <div className={`w-full h-[calc(100vh-100px)] overflow-hidden transition-opacity-smooth ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* Carousel View */}
        {viewMode === 'carousel' && (
          <div ref={scrollContainerRef} className={`h-full overflow-x-auto overflow-y-hidden transition-opacity-smooth ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ scrollbarWidth: 'none' }}>
            <div key={activeCategory} className="flex h-full items-center" style={{ width: 'max-content', paddingLeft: ((showInfo || showContact) && returnToGrid) ? 'var(--info-padding)' : '150px', paddingRight: '150px' }}>
              {filteredProjects.map((project, projectIndex) => {
              // Calculate project start index for global frame numbering
              const projectStartIndex = orderedProjects.slice(0, orderedProjects.findIndex(p => p.id === project.id))
                .reduce((acc, p) => acc + p.media.length, 0);

              // All projects use the same gap for spacing between projects
              // First project has no extra left margin since carousel padding provides the edge spacing
              const isFirstProject = projectIndex === 0;

              return (
                <div key={`${activeCategory}-${project.id}`} className="flex items-center h-full">
                  {/* Project title - vertical (invisible but keeps space in info/contact mode to prevent jump) */}
                  <div
                    className={`flex-shrink-0 flex items-end pb-4 transition-opacity-smooth ${showInfo || showContact ? 'opacity-0' : 'opacity-100'}`}
                    style={{ height: 'var(--carousel-height)', marginLeft: isFirstProject ? '0' : 'var(--carousel-project-gap)', marginRight: 'var(--carousel-title-gap)' }}
                  >
                    <span
                      className="text-4xl tracking-wide text-black/60 dark:text-white/60"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontWeight: 700,
                      }}
                    >
                      {project.title}
                    </span>
                  </div>
                  {/* Project group */}
                  <div className="flex items-center h-full" style={{ gap: 'var(--carousel-gap)' }}>
                    {project.media.map((item, mediaIndex) => {
                      // Calculate global media index
                      const globalIndex = projectStartIndex + mediaIndex;

                      // Use isLandscape directly from the item
                      const isLandscape = item.isLandscape || false;

                      // Find if this frame should show info content
                      const visiblePosition = visibleFrameIndices.indexOf(globalIndex);

                      // For portrait frames: 1 info section per frame
                      // For landscape frames: 2 info sections side-by-side
                      let infoItem: InfoItem | null = null;
                      let infoItem2: InfoItem | null = null;

                      if (visiblePosition !== -1) {
                        // Calculate which info section index this frame should start at
                        // by counting sections used by previous frames
                        let sectionIndex = 0;
                        for (let i = 0; i < visiblePosition; i++) {
                          const prevFrameIndex = visibleFrameIndices[i];
                          const prevMediaItem = allMediaItems.find(m => m.globalIndex === prevFrameIndex);
                          sectionIndex += prevMediaItem?.isLandscape ? 2 : 1;
                        }

                        // Only show content if we haven't exceeded our sections
                        if (sectionIndex < INFO_CONTENT.length) {
                          if (isLandscape) {
                            // Landscape: show 2 sections side-by-side (second may be null if we run out)
                            infoItem = INFO_CONTENT[sectionIndex];
                            infoItem2 = INFO_CONTENT[sectionIndex + 1] || null;
                          } else {
                            // Portrait: show exactly 1 section, never 2
                            infoItem = INFO_CONTENT[sectionIndex];
                            infoItem2 = null; // Explicitly null for portrait
                          }
                        }
                      }

                      // In info mode from grid, only show frames in visibleFrameIndices
                      // In info mode from carousel, show ALL frames (overlays only on selected ones)
                      // In contact mode, show all frames
                      const shouldShowFrame = !showInfo || !returnToGrid || visibleFrameIndices.includes(globalIndex);

                      if (!shouldShowFrame) return null;

                      // Determine aspect ratio: landscape = 16:9, portrait = 4:5
                      const isLandscapeFrame = item.isLandscape === true;

                      return (
                        <div
                          key={`${project.id}-${mediaIndex}`}
                          ref={(el) => {
                            if (el) frameRefs.current.set(globalIndex, el);
                            else frameRefs.current.delete(globalIndex);
                          }}
                          className={`relative flex-shrink-0 cursor-pointer ${isLandscapeFrame ? 'aspect-video' : 'aspect-[4/5]'}`}
                          style={{
                            height: 'var(--carousel-height)',
                          }}
                          onClick={() => {
                            // If info is showing, close it and return to gallery (or grid if we came from there)
                            if (showInfo) {
                              if (returnToGrid) {
                                setIsTransitioning(true);
                                setShowInfo(false);
                                setTimeout(() => {
                                  setReturnToGrid(false);
                                  setViewMode('grid');
                                  requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                      setIsTransitioning(false);
                                    });
                                  });
                                }, 600);
                              } else {
                                setShowInfo(false);
                              }
                              return;
                            }
                            // If contact is showing and clicking a different frame, unlock contact mode
                            if (showContact && globalIndex !== contactFrameIndex) {
                              if (returnToGrid) {
                                setIsTransitioning(true);
                                setShowContact(false);
                                setTimeout(() => {
                                  setReturnToGrid(false);
                                  setViewMode('grid');
                                  requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                      setIsTransitioning(false);
                                    });
                                  });
                                }, 600);
                              } else {
                                setShowContact(false);
                              }
                              return;
                            }
                            // Normal click behavior - expand media (but not in contact mode)
                            if (!showContact) {
                              setExpandedMedia({ item, projectTitle: project.title, globalIndex });
                            }
                          }}
                        >
                          {/* Media - use object-cover to fill frame completely */}
                          {item.type === 'video' ? (
                            // Use Vimeo iframe in production when vimeoId exists, local file in dev
                            item.vimeoId && process.env.NODE_ENV === 'production' ? (
                              <div
                                className={`w-full h-full overflow-hidden transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) ? 'opacity-30' : 'opacity-100'}`}
                              >
                                <iframe
                                  src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                                  className="border-0"
                                  allow="autoplay; fullscreen"
                                  style={{
                                    pointerEvents: 'none',
                                    // For portrait 9:16 video in 4:5 frame: scale width to 177.78% (16/9) and center with negative margin
                                    // For landscape 16:9 video in 16:9 frame: no scaling needed
                                    width: isLandscapeFrame ? '100%' : '177.78%',
                                    height: '100%',
                                    marginLeft: isLandscapeFrame ? '0' : '-38.89%',
                                  }}
                                />
                              </div>
                            ) : (
                              <video
                                src={item.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={`w-full h-full object-cover transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) ? 'opacity-30' : 'opacity-100'}`}
                              />
                            )
                          ) : (
                            <img
                              src={item.src}
                              alt=""
                              className={`w-full h-full object-cover transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) ? 'opacity-30' : 'opacity-100'}`}
                            />
                          )}

                          {/* Info overlay on this frame */}
                          {showInfo && infoItem && (
                            <InfoOverlay
                              isLandscape={isLandscape}
                              infoItem={infoItem}
                              infoItem2={infoItem2}
                              onClose={() => {
                                if (returnToGrid) {
                                  setIsTransitioning(true);
                                  setShowInfo(false);
                                  setTimeout(() => {
                                    setReturnToGrid(false);
                                    setViewMode('grid');
                                    requestAnimationFrame(() => {
                                      requestAnimationFrame(() => {
                                        setIsTransitioning(false);
                                      });
                                    });
                                  }, 600);
                                } else {
                                  setShowInfo(false);
                                }
                              }}
                            />
                          )}

                          {/* Contact overlay on this frame */}
                          {showContact && globalIndex === contactFrameIndex && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-[#1a1a1a]/50">
                              <a
                                href={`mailto:${CONTACT_CONTENT.email}`}
                                className="text-2xl md:text-3xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white mb-4"
                                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                              >
                                {CONTACT_CONTENT.email}
                              </a>
                              <a
                                href="https://instagram.com/hofman.studio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl md:text-3xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white"
                                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                              >
                                {CONTACT_CONTENT.instagram}
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Grid View - horizontal scroll with 2 rows, landscape takes 2x width */}
        {viewMode === 'grid' && (
          <div ref={scrollContainerRef} className={`h-full overflow-x-auto overflow-y-hidden flex items-center transition-opacity-smooth ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ scrollbarWidth: 'none', paddingLeft: 'var(--grid-padding)', paddingRight: 'var(--grid-padding)' }}>
            <div className="flex flex-col flex-wrap content-start" style={{ width: 'max-content', height: 'var(--carousel-height)', gap: 'var(--grid-gap)' }}>
              {filteredProjects.map((project) => {
                // Calculate project start index for global frame numbering
                const projectStartIndex = orderedProjects.slice(0, orderedProjects.findIndex(p => p.id === project.id))
                  .reduce((acc, p) => acc + p.media.length, 0);

                return project.media.map((item, mediaIndex) => {
                  const globalIndex = projectStartIndex + mediaIndex;

                  // Determine aspect ratio: landscape = 16:9, portrait = 4:5
                  const isLandscapeGridFrame = item.isLandscape === true;

                  return (
                    <div
                      key={`${project.id}-${mediaIndex}`}
                      className={`relative cursor-pointer group overflow-hidden flex-shrink-0 ${isLandscapeGridFrame ? 'aspect-video' : 'aspect-[4/5]'}`}
                      style={{
                        height: 'var(--grid-row-height)',
                      }}
                      onClick={() => setExpandedMedia({ item, projectTitle: project.title, globalIndex })}
                    >
                      {item.type === 'video' ? (
                        item.vimeoId && process.env.NODE_ENV === 'production' ? (
                          <div className="w-full h-full overflow-hidden transition-transform-smooth group-hover:scale-105">
                            <iframe
                              src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                              className="border-0"
                              allow="autoplay; fullscreen"
                              style={{
                                pointerEvents: 'none',
                                width: item.isLandscape ? '100%' : '177.78%',
                                height: item.isLandscape ? '100%' : '100%',
                                marginLeft: item.isLandscape ? '0' : '-38.89%',
                              }}
                            />
                          </div>
                        ) : (
                          <video
                            src={item.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform-smooth group-hover:scale-105"
                          />
                        )
                      ) : (
                        <img
                          src={item.src}
                          alt=""
                          className="w-full h-full object-cover transition-transform-smooth group-hover:scale-105"
                        />
                      )}
                      {/* Project title on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity-smooth">
                        <span className="text-white text-sm" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>{project.title}</span>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        )}

        {/* Expanded overlay / Lightbox */}
        {expandedMedia && (() => {
          // Get flattened list of all media with project info for navigation
          const allFlatMedia = filteredProjects.flatMap(project =>
            project.media.map(item => ({ item, projectTitle: project.title }))
          );
          const currentIndex = expandedMedia.globalIndex;
          const totalItems = allFlatMedia.length;

          const goToPrev = () => {
            if (currentIndex > 0) {
              const prevIndex = currentIndex - 1;
              const prev = allFlatMedia[prevIndex];
              setExpandedMedia({ item: prev.item, projectTitle: prev.projectTitle, globalIndex: prevIndex });
            }
          };

          const goToNext = () => {
            if (currentIndex < totalItems - 1) {
              const nextIndex = currentIndex + 1;
              const next = allFlatMedia[nextIndex];
              setExpandedMedia({ item: next.item, projectTitle: next.projectTitle, globalIndex: nextIndex });
            }
          };

          const { item } = expandedMedia;

          return (
            <div
              className="fixed inset-0 z-50 bg-white dark:bg-[#1a1a1a] flex items-center justify-center"
              onClick={() => setExpandedMedia(null)}
            >
              {/* Left click zone for previous */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w-resize z-10"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              />

              {/* Right click zone for next */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1/3 cursor-e-resize z-10"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              />

              {/* Media container */}
              <div className="relative max-w-[95vw] max-h-[80vh]" onClick={e => e.stopPropagation()}>
                {item.type === 'video' ? (
                  item.vimeoId && process.env.NODE_ENV === 'production' ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                      className="max-h-[80vh] border-0"
                      style={{
                        aspectRatio: item.isLandscape ? '16/9' : '9/16',
                        width: item.isLandscape ? '90vw' : 'auto',
                        height: item.isLandscape ? 'auto' : '80vh',
                      }}
                      allow="autoplay; fullscreen"
                    />
                  ) : (
                    item.isLandscape ? (
                      <video
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-[80vh] max-w-[95vw] object-contain"
                      />
                    ) : (
                      <div
                        className="relative h-[80vh] overflow-hidden"
                        style={{ width: 'calc(80vh * 9 / 16)' }}
                      >
                        <video
                          src={item.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                        />
                      </div>
                    )
                  )
                ) : (
                  <img
                    src={item.src}
                    alt=""
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                )}
              </div>

              {/* Info bar at bottom - centered */}
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
                <span
                  className="text-2xl text-black dark:text-white"
                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                >
                  {expandedMedia.projectTitle}
                </span>
                <div className="flex items-center gap-4">
                  {item.process && (
                    <span
                      className="text-sm text-black/50 dark:text-white/50 uppercase tracking-widest"
                      style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                    >
                      {item.process}
                    </span>
                  )}
                  <span
                    className="text-sm text-black/30 dark:text-white/30"
                    style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                  >
                    {currentIndex + 1} / {totalItems}
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                className="absolute top-5 right-5 text-black dark:text-white text-2xl hover:opacity-50 transition-opacity duration-300 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia(null);
                }}
              >
                ×
              </button>

              {/* Navigation arrows (visible on hover) */}
              {currentIndex > 0 && (
                <button
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-4xl transition-opacity duration-300 z-20"
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                >
                  ←
                </button>
              )}
              {currentIndex < totalItems - 1 && (
                <button
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-4xl transition-opacity duration-300 z-20"
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                >
                  →
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Navigation Footer */}
      <NavFooter
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        showInfoOverlay={showInfo}
        onInfoToggle={handleInfoToggle}
        showContactOverlay={showContact}
        onContactToggle={handleContactToggle}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
    </>
  );
}
