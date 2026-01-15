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
    title: 'Services',
    content: `Product photography direction\nMotion and film\nConcept development\nAI workflow consulting`
  },
  {
    title: 'Contact',
    content: `hello@hofman.studio`,
    isEmail: true
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
  { src: "/images/Merit/freepik__enhance__74134.jpg", type: "image", layout: "split" },
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
                        {section.isEmail ? (
                          <a
                            href={`mailto:${section.content}`}
                            className="text-lg hover:opacity-50 transition-opacity duration-300"
                            style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                          >
                            {section.content}
                          </a>
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
                          {section.isEmail ? (
                            <a
                              href={`mailto:${section.content}`}
                              className="text-base hover:opacity-50 transition-opacity duration-300"
                              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                            >
                              {section.content}
                            </a>
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
