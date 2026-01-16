'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { IntroSplash } from '@/components/IntroSplash';
import { NavFooter } from '@/components/NavFooter';
import { MobileSite } from '@/components/MobileSite';
import { useIsMobile } from '@/lib/useIsMobile';

type Category = 'all' | 'motion' | 'stills' | 'research';
type ViewMode = 'carousel' | 'grid';

type MediaItem = {
  src: string;
  type: 'image' | 'video';
  isLandscape?: boolean;
  vimeoId?: string; // Vimeo video ID for production streaming
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
const WORK_PROJECTS = [
  {
    id: 'horlogerie',
    title: 'Horlogerie',
    media: [
      { src: "/images/Watch report/freepik__enhance__46843.jpg", type: "image" as const, isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__73551.jpg", type: "image" as const, isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__83979.jpg", type: "image" as const, isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__83980.jpg", type: "image" as const, isLandscape: false },
    ],
  },
  {
    id: 'wild-rose',
    title: 'Wild Rose',
    media: [
      { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688609" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688545" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_094147.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688574" },
      { src: "/videos/Wild rose/2026-01-07T21-52-22_luma_prompt__.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688635" },
    ],
  },
  {
    id: 'merit',
    title: 'Merit Beauty',
    media: [
      { src: "/images/Merit/freepik__enhance__74134.jpg", type: "image" as const, isLandscape: false },
      { src: "/images/Merit/SH_t9w9cp.jpg", type: "image" as const, isLandscape: false },
    ],
  },
  {
    id: 'gucci',
    title: 'Gucci Beauty',
    priority: 1, // Featured project - appears first
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg", type: "image" as const, isLandscape: false },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg", type: "image" as const, isLandscape: false },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154689508" },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154689448" },
      { src: "/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688746" },
      { src: "/videos/Asbstracts/Professional_Mode_Camera_is_locked__A_transparent__4_chf3_prob4.mov", type: "video" as const, isLandscape: true, vimeoId: "1154688698" },
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
  const [expandedMedia, setExpandedMedia] = useState<{ src: string; type: 'image' | 'video'; vimeoId?: string } | null>(null);
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
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure new view is rendered before fading in
    }, 500); // Duration of fade out - matches luxury easing
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
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 500);
      } else {
        // In carousel mode, overlay info on currently visible frames
        // Portrait frames show 1 section, landscape frames show 2 sections
        const container = scrollContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const visibleFrames: { index: number; isLandscape: boolean }[] = [];

          // Find all frames that are currently visible in the viewport
          frameRefs.current.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const mediaItem = allMediaItems.find(m => m.globalIndex === index);
            // Check if frame is at least partially visible
            if (rect.right > containerRect.left && rect.left < containerRect.right) {
              visibleFrames.push({ index, isLandscape: mediaItem?.isLandscape || false });
            }
          });

          // Sort by position (left to right)
          visibleFrames.sort((a, b) => a.index - b.index);

          // Select frames to cover all INFO_CONTENT sections
          // Landscape = 2 sections, Portrait = 1 section
          const framesToUse: number[] = [];
          let sectionsUsed = 0;

          for (const frame of visibleFrames) {
            if (sectionsUsed >= INFO_CONTENT.length) break;
            framesToUse.push(frame.index);
            sectionsUsed += frame.isLandscape ? 2 : 1;
          }

          // If we don't have enough visible frames, add more frames
          if (sectionsUsed < INFO_CONTENT.length) {
            const allFrameIndices = allMediaItems.map(m => ({ index: m.globalIndex, isLandscape: m.isLandscape }));
            const availableFrames = allFrameIndices.filter(f => !framesToUse.includes(f.index));

            // Add frames after the visible ones first
            const lastVisibleIdx = framesToUse[framesToUse.length - 1] ?? -1;
            const laterFrames = availableFrames.filter(f => f.index > lastVisibleIdx);

            for (const frame of laterFrames) {
              if (sectionsUsed >= INFO_CONTENT.length) break;
              framesToUse.push(frame.index);
              sectionsUsed += frame.isLandscape ? 2 : 1;
            }

            // If still not enough, add earlier frames
            if (sectionsUsed < INFO_CONTENT.length) {
              const firstVisibleIdx = framesToUse[0] ?? Infinity;
              const earlierFrames = availableFrames
                .filter(f => f.index < firstVisibleIdx && !framesToUse.includes(f.index))
                .reverse(); // Start from closest to visible

              for (const frame of earlierFrames) {
                if (sectionsUsed >= INFO_CONTENT.length) break;
                framesToUse.unshift(frame.index); // Add to beginning
                sectionsUsed += frame.isLandscape ? 2 : 1;
              }
            }
          }

          // Sort final list
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
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 500);
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
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 500);
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
          setTimeout(() => {
            setIsTransitioning(false);
          }, 50);
        }, 500);
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
            <div key={activeCategory} className="flex h-full items-center px-[300px]" style={{ width: 'max-content' }}>
              {filteredProjects.map((project, projectIndex) => {
              // Calculate project start index for global frame numbering
              const projectStartIndex = orderedProjects.slice(0, orderedProjects.findIndex(p => p.id === project.id))
                .reduce((acc, p) => acc + p.media.length, 0);

              return (
                <div key={`${activeCategory}-${project.id}`} className="flex items-center h-full">
                  {/* Project title - vertical (invisible but keeps space in info/contact mode to prevent jump) */}
                  <div className={`flex-shrink-0 h-[calc(100vh-150px)] flex items-end pb-4 mr-4 transition-opacity-smooth ${showInfo || showContact ? 'opacity-0' : 'opacity-100'}`}>
                    <span
                      className="text-4xl tracking-wide text-black/60 dark:text-white/60"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontFamily: 'Georgia, "Times New Roman", Times, serif',
                      }}
                    >
                      {project.title}
                    </span>
                  </div>
                  {/* Project group */}
                  <div className="flex items-center gap-2 h-full">
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

                        if (isLandscape) {
                          // Landscape: show 2 sections side-by-side
                          infoItem = INFO_CONTENT[sectionIndex] || null;
                          infoItem2 = INFO_CONTENT[sectionIndex + 1] || null;
                        } else {
                          // Portrait: show 1 section
                          infoItem = INFO_CONTENT[sectionIndex] || null;
                        }
                      }

                      // In info mode from grid, only show frames in visibleFrameIndices
                      // In info mode from carousel, show ALL frames (overlays only on selected ones)
                      // In contact mode, show all frames
                      const shouldShowFrame = !showInfo || !returnToGrid || visibleFrameIndices.includes(globalIndex);

                      if (!shouldShowFrame) return null;

                      return (
                        <div
                          key={`${project.id}-${mediaIndex}`}
                          ref={(el) => {
                            if (el) frameRefs.current.set(globalIndex, el);
                            else frameRefs.current.delete(globalIndex);
                          }}
                          className="relative h-[calc(100vh-150px)] flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            // If info is showing, close it and return to gallery (or grid if we came from there)
                            if (showInfo) {
                              if (returnToGrid) {
                                setIsTransitioning(true);
                                setShowInfo(false);
                                setTimeout(() => {
                                  setReturnToGrid(false);
                                  setViewMode('grid');
                                  setTimeout(() => {
                                    setIsTransitioning(false);
                                  }, 50);
                                }, 500);
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
                                  setTimeout(() => {
                                    setIsTransitioning(false);
                                  }, 50);
                                }, 500);
                              } else {
                                setShowContact(false);
                              }
                              return;
                            }
                            // Normal click behavior - expand media (but not in contact mode)
                            if (!showContact) {
                              setExpandedMedia(item);
                            }
                          }}
                        >
                          {/* Media container with permanent divider for landscape */}
                          <div className="relative h-full">
                            {item.type === 'video' ? (
                              // Use Vimeo iframe in production when vimeoId exists, local file in dev
                              item.vimeoId && process.env.NODE_ENV === 'production' ? (
                                <iframe
                                  src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                                  className={`h-full w-auto aspect-video border-0 transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) ? 'opacity-30' : 'opacity-100'}`}
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
                                  className={`h-full w-auto object-contain transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) ? 'opacity-30' : 'opacity-100'}`}
                                />
                              )
                            ) : (
                              <img
                                src={item.src}
                                alt=""
                                className={`h-full w-auto object-contain transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) ? 'opacity-30' : 'opacity-100'}`}
                              />
                            )}

                            {/* Divider for landscape frames - only show when Practice is active */}
                            {isLandscape && showInfo && (
                              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/30 dark:bg-white/30 pointer-events-none" />
                            )}
                          </div>

                          {/* Info overlay on this frame - landscape frames get 2 info sections side-by-side */}
                          {showInfo && infoItem && (
                            isLandscape ? (
                              // Landscape video: 2 info sections side-by-side (editorial)
                              <div className="absolute inset-0 flex bg-white/40 dark:bg-[#1a1a1a]/40 cursor-pointer" onClick={() => setShowInfo(false)}>
                                {/* Left half - First info section */}
                                <div className={`w-1/2 flex flex-col ${infoItem2 ? 'justify-between' : 'justify-between'}`} style={{ padding: '40px' }}>
                                  <h2
                                    className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none text-black dark:text-white"
                                    style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                                  >
                                    {infoItem.title}
                                  </h2>
                                  {infoItem.isEmail ? (
                                    <a
                                      href={`mailto:${infoItem.content}`}
                                      className="text-xl md:text-2xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white"
                                      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', fontStyle: 'italic' }}
                                    >
                                      {infoItem.content}
                                    </a>
                                  ) : (
                                    <p
                                      className="text-xl md:text-2xl leading-tight text-black/80 dark:text-white/80 tracking-tight"
                                      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                                    >
                                      {infoItem.content.split('\n\n').map((para: string, i: number) => (
                                        <span key={i}>{i > 0 && <><br /><br /></>}{para}</span>
                                      ))}
                                    </p>
                                  )}
                                </div>
                                {/* Divider line - always show for landscape layout */}
                                <div className="w-[2px] bg-black/40 dark:bg-white/40 my-[40px]" />
                                {/* Right half - Second info section (or empty) */}
                                <div className="w-1/2 flex flex-col justify-between" style={{ padding: '40px' }}>
                                  {infoItem2 && (
                                    <>
                                      <h2
                                        className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none text-black dark:text-white"
                                        style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                                      >
                                        {infoItem2.title}
                                      </h2>
                                      {infoItem2.isEmail ? (
                                        <a
                                          href={`mailto:${infoItem2.content}`}
                                          className="text-xl md:text-2xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white"
                                          style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', fontStyle: 'italic' }}
                                        >
                                          {infoItem2.content}
                                        </a>
                                      ) : (
                                        <p
                                          className="text-xl md:text-2xl leading-tight text-black/80 dark:text-white/80 tracking-tight"
                                          style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                                        >
                                          {infoItem2.content.split('\n\n').map((para: string, i: number) => (
                                            <span key={i}>{i > 0 && <><br /><br /></>}{para}</span>
                                          ))}
                                        </p>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : (
                              // Portrait image: editorial stacked layout
                              <div className="absolute inset-0 flex flex-col justify-between bg-white/40 dark:bg-[#1a1a1a]/40 cursor-pointer" style={{ padding: '40px' }} onClick={() => setShowInfo(false)}>
                                {/* Title at top - bold sans-serif */}
                                <div>
                                  <h2
                                    className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-none text-black dark:text-white"
                                    style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                                  >
                                    {infoItem.title}
                                  </h2>
                                </div>
                                {/* Content at bottom - elegant serif */}
                                <div>
                                  {infoItem.isEmail ? (
                                    <a
                                      href={`mailto:${infoItem.content}`}
                                      className="text-xl md:text-2xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white"
                                      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', fontStyle: 'italic' }}
                                    >
                                      {infoItem.content}
                                    </a>
                                  ) : (
                                    <p
                                      className="text-xl md:text-2xl leading-tight text-black/80 dark:text-white/80 tracking-tight"
                                      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                                    >
                                      {infoItem.content.split('\n\n').map((para: string, i: number) => (
                                        <span key={i}>{i > 0 && <><br /><br /></>}{para}</span>
                                      ))}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
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

                  {/* Spacer between projects (except after last, invisible in info/contact mode to prevent jump) */}
                  {projectIndex < filteredProjects.length - 1 && (
                    <div className={`w-24 flex-shrink-0 transition-opacity-smooth ${showInfo || showContact ? 'opacity-0' : 'opacity-100'}`} />
                  )}
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Grid View - horizontal scroll with 2 rows, landscape takes 2x width */}
        {viewMode === 'grid' && (
          <div ref={scrollContainerRef} className={`h-full overflow-x-auto overflow-y-hidden px-[150px] flex items-center transition-opacity-smooth ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ scrollbarWidth: 'none' }}>
            <div className="h-[calc(100vh-150px)] flex flex-col flex-wrap content-start gap-2" style={{ width: 'max-content' }}>
              {filteredProjects.map((project) => (
                project.media.map((item, mediaIndex) => {
                  // Use isLandscape from media item data
                  // All items same height (half the container)
                  // Landscape takes 2x the width of a portrait

                  return (
                    <div
                      key={`${project.id}-${mediaIndex}`}
                      className="relative cursor-pointer group overflow-hidden flex-shrink-0 h-[calc((100vh-150px-0.5rem)/2)]"
                      style={{
                        aspectRatio: item.isLandscape ? '16/9' : '4/5'
                      }}
                      onClick={() => setExpandedMedia(item)}
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
                })
              ))}
            </div>
          </div>
        )}

        {/* Expanded overlay */}
        {expandedMedia && (
          <div
            className="fixed inset-0 z-50 bg-white dark:bg-[#1a1a1a] flex items-center justify-center cursor-pointer"
            onClick={() => setExpandedMedia(null)}
          >
            <div className="relative max-w-[95vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
              {expandedMedia.type === 'video' ? (
                expandedMedia.vimeoId && process.env.NODE_ENV === 'production' ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${expandedMedia.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                    className="w-[90vw] max-h-[90vh] aspect-video border-0"
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <video
                    src={expandedMedia.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-w-full max-h-[90vh] object-contain"
                  />
                )
              ) : (
                <img
                  src={expandedMedia.src}
                  alt=""
                  className="max-w-full max-h-[90vh] object-contain"
                />
              )}
            </div>
            <button
              className="absolute top-5 right-5 text-black dark:text-white text-2xl hover:opacity-50 transition-opacity duration-300"
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
