'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface InformationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Content sections to display in frames
const INFO_SECTIONS = [
  {
    title: 'About',
    content: `Hofman Studio is a production practice applying material intelligence to luxury brands. We direct AI-native workflows for spirits, beauty, and fragrance, combining 15 years of photography and film expertise with emerging production technologies.`
  },
  {
    title: 'Approach',
    content: `Every project begins with material study. We understand how light interacts with glass, how liquids move, how surfaces reflect. This physical understanding informs how we direct AI tools to achieve craft-quality results at production speed.`
  },
  {
    title: 'What we make',
    subtitle: 'AI-directed stills and motion for luxury brands.',
    deliverables: ['Campaign imagery', 'Product photography', 'Social content', 'Motion for digital'],
    positioning: ['Directed, not automated.', 'Every frame reviewed by someone who knows how light hits glass.'],
    focus: ['Spirits', 'Beauty', 'Fragrance', 'Luxury CPG'],
    isServices: true
  },
  {
    title: 'Contact',
    content: `AI-directed production.\nLuxury stills and motion. Built on 15 years of tabletop craft.\nLondon.\n\nsam@hofman.studio\n@hofman.studio\nLinkedIn\n\nTraditional photography: samhofman.com`,
    isContact: true
  }
];

// Media to use as frames
interface FrameMedia {
  src: string;
  type: 'video' | 'image';
  layout: 'full' | 'split';
}

const FRAME_MEDIA: FrameMedia[] = [
  { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video", layout: "full" },
  { src: "/images/Watch report/freepik__enhance__46843.jpg", type: "image", layout: "split" },
  { src: "/images/Merit/SH_Merti_s1.jpg", type: "image", layout: "split" },
  { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video", layout: "full" },
];

export const InformationOverlay = ({ isOpen, onClose }: InformationOverlayProps) => {
  const luxuryEase = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: luxuryEase }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="fixed top-6 right-8 z-[110] text-2xl text-black/60 hover:text-black transition-colors duration-300"
          >
            ×
          </button>

          {/* Frames with content */}
          <div className="min-h-screen flex flex-col items-center justify-center py-20 px-8 gap-8">
            {INFO_SECTIONS.map((section, index) => {
              const media = FRAME_MEDIA[index % FRAME_MEDIA.length];
              const isFullWidth = media.layout === 'full';
              const nextMedia = FRAME_MEDIA[(index + 1) % FRAME_MEDIA.length];

              return (
                <motion.div
                  key={section.title}
                  className={`relative ${isFullWidth ? 'w-full max-w-4xl' : 'w-full max-w-5xl'}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, ease: luxuryEase, delay: 0.1 + index * 0.1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isFullWidth ? (
                    /* Full width video/image frame */
                    <div className="relative aspect-video overflow-hidden">
                      {/* Washed out media */}
                      {media.type === 'video' ? (
                        <video
                          src={media.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      ) : (
                        <img
                          src={media.src}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      )}
                      {/* White overlay for wash effect */}
                      <div className="absolute inset-0 bg-white/60" />

                      {/* Content overlay */}
                      <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center">
                        <h2 className="font-calibre text-2xl mb-6">{section.title}</h2>
                        {section.isServices ? (
                          <div className="space-y-6" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
                            <p className="text-base text-black/80">{section.subtitle}</p>
                            <div className="space-y-1">
                              {section.deliverables?.map((item, i) => (
                                <p key={i} className="text-base text-black/80">{item}</p>
                              ))}
                            </div>
                            <div className="pt-4 space-y-1">
                              {section.positioning?.map((line, i) => (
                                <p key={i} className="text-sm text-black/60 italic">{line}</p>
                              ))}
                            </div>
                            <div className="pt-2">
                              <p className="text-xs text-black/40 uppercase tracking-wider">{section.focus?.join(' · ')}</p>
                            </div>
                          </div>
                        ) : section.isContact ? (
                          <div className="space-y-4" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
                            <p className="text-base text-black/80">
                              AI-directed production.<br/>
                              Luxury stills and motion. Built on 15 years of tabletop craft.<br/>
                              London.
                            </p>
                            <div className="space-y-2 pt-4">
                              <a href="mailto:sam@hofman.studio" className="block text-base hover:opacity-50 transition-opacity duration-300">sam@hofman.studio</a>
                              <a href="https://www.instagram.com/hofman.studio" target="_blank" rel="noopener noreferrer" className="block text-base hover:opacity-50 transition-opacity duration-300">@hofman.studio</a>
                              <a href="https://linkedin.com/in/samhofman" target="_blank" rel="noopener noreferrer" className="block text-base hover:opacity-50 transition-opacity duration-300">LinkedIn</a>
                            </div>
                            <div className="pt-4">
                              <p className="text-sm text-black/60">Traditional photography</p>
                              <a href="https://www.samhofman.com" target="_blank" rel="noopener noreferrer" className="text-base hover:opacity-50 transition-opacity duration-300">samhofman.com</a>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="text-base leading-relaxed text-black/80 max-w-xl whitespace-pre-line"
                            style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                          >
                            {section.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Split across 2 portrait images */
                    <div className="flex gap-4">
                      {/* Left image with title */}
                      <div className="relative flex-1 aspect-[3/4] overflow-hidden">
                        <img
                          src={media.src}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-white/60" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                          <h2 className="font-calibre text-2xl">{section.title}</h2>
                        </div>
                      </div>

                      {/* Right image with content */}
                      <div className="relative flex-1 aspect-[3/4] overflow-hidden">
                        <img
                          src={nextMedia.src}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-white/60" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                          {section.isServices ? (
                            <div className="space-y-4" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
                              <p className="text-sm text-black/80">{section.subtitle}</p>
                              <div className="space-y-1">
                                {section.deliverables?.map((item, i) => (
                                  <p key={i} className="text-sm text-black/80">{item}</p>
                                ))}
                              </div>
                              <div className="pt-3 space-y-1">
                                {section.positioning?.map((line, i) => (
                                  <p key={i} className="text-xs text-black/60 italic">{line}</p>
                                ))}
                              </div>
                              <div className="pt-2">
                                <p className="text-[10px] text-black/40 uppercase tracking-wider">{section.focus?.join(' · ')}</p>
                              </div>
                            </div>
                          ) : section.isContact ? (
                            <div className="space-y-3" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
                              <p className="text-sm text-black/80">
                                AI-directed production.<br/>
                                Luxury stills and motion. Built on 15 years of tabletop craft.<br/>
                                London.
                              </p>
                              <div className="space-y-1 pt-3">
                                <a href="mailto:sam@hofman.studio" className="block text-sm hover:opacity-50 transition-opacity duration-300">sam@hofman.studio</a>
                                <a href="https://www.instagram.com/hofman.studio" target="_blank" rel="noopener noreferrer" className="block text-sm hover:opacity-50 transition-opacity duration-300">@hofman.studio</a>
                                <a href="https://linkedin.com/in/samhofman" target="_blank" rel="noopener noreferrer" className="block text-sm hover:opacity-50 transition-opacity duration-300">LinkedIn</a>
                              </div>
                              <div className="pt-3">
                                <p className="text-xs text-black/60">Traditional photography</p>
                                <a href="https://www.samhofman.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:opacity-50 transition-opacity duration-300">samhofman.com</a>
                              </div>
                            </div>
                          ) : (
                            <p
                              className="text-sm leading-relaxed text-black/80 whitespace-pre-line"
                              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                            >
                              {section.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
