'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
    src: string;
    type: 'image' | 'video';
}

interface ProjectData {
    id: string;
    title: string;
    subtitle: string;
    media: MediaItem[];
}

interface WorkGridProps {
    projects: ProjectData[];
    onProjectClick?: (projectId: string) => void;
}

// Floating overlay carousel component
function FloatingCarousel({
    project,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev
}: {
    project: ProjectData;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-cycle through images
    useEffect(() => {
        if (isAutoPlaying && project.media.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % project.media.length);
            }, 2500);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isAutoPlaying, project.media.length]);

    // Reset index when project changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsAutoPlaying(true);
    }, [project.id]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') {
                setIsAutoPlaying(false);
                if (currentIndex < project.media.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else if (hasNext) {
                    onNext();
                }
            }
            if (e.key === 'ArrowLeft') {
                setIsAutoPlaying(false);
                if (currentIndex > 0) {
                    setCurrentIndex(prev => prev - 1);
                } else if (hasPrev) {
                    onPrev();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev, hasNext, hasPrev, currentIndex, project.media.length]);

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

            {/* Carousel container */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-6xl mx-4 md:mx-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 z-20 w-10 h-10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors duration-300"
                    aria-label="Close"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Main image area */}
                <div className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden bg-black/5 rounded-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${project.id}-${currentIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0"
                        >
                            {project.media[currentIndex].type === 'video' ? (
                                <video
                                    src={project.media[currentIndex].src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={project.media[currentIndex].src}
                                    alt={project.title}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation arrows - inside image */}
                    <button
                        onClick={() => {
                            setIsAutoPlaying(false);
                            if (currentIndex > 0) {
                                setCurrentIndex(prev => prev - 1);
                            } else if (hasPrev) {
                                onPrev();
                            }
                        }}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full text-foreground/60 hover:text-foreground hover:bg-background transition-all duration-300 ${
                            currentIndex === 0 && !hasPrev ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        disabled={currentIndex === 0 && !hasPrev}
                        aria-label="Previous"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <button
                        onClick={() => {
                            setIsAutoPlaying(false);
                            if (currentIndex < project.media.length - 1) {
                                setCurrentIndex(prev => prev + 1);
                            } else if (hasNext) {
                                onNext();
                            }
                        }}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full text-foreground/60 hover:text-foreground hover:bg-background transition-all duration-300 ${
                            currentIndex === project.media.length - 1 && !hasNext ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        disabled={currentIndex === project.media.length - 1 && !hasNext}
                        aria-label="Next"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Bottom bar with title and indicators */}
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span
                            className="font-serif text-xl md:text-2xl text-foreground uppercase tracking-wide"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                        >
                            {project.title}
                        </span>
                        <span className="font-sans text-sm text-foreground/50 ml-4">
                            {project.subtitle}
                        </span>
                    </div>

                    {/* Dot indicators */}
                    {project.media.length > 1 && (
                        <div className="flex items-center gap-2">
                            {project.media.map((_, dotIndex) => (
                                <button
                                    key={dotIndex}
                                    onClick={() => goToSlide(dotIndex)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        dotIndex === currentIndex
                                            ? 'bg-foreground'
                                            : 'bg-foreground/30 hover:bg-foreground/50'
                                    }`}
                                    aria-label={`Go to slide ${dotIndex + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Project navigation hint */}
                <div className="flex justify-center mt-6 gap-8 text-sm text-foreground/40">
                    {hasPrev && (
                        <button
                            onClick={onPrev}
                            className="hover:text-foreground transition-colors duration-300"
                        >
                            ← Previous project
                        </button>
                    )}
                    {hasNext && (
                        <button
                            onClick={onNext}
                            className="hover:text-foreground transition-colors duration-300"
                        >
                            Next project →
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Individual grid item with carousel on hover
function GridItem({ project, index, onClick }: {
    project: ProjectData;
    index: number;
    onClick: () => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isHovering && project.media.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % project.media.length);
            }, 1200);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (!isHovering) setCurrentIndex(0);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovering, project.media.length]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.06,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }}
            className="group cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-image-placeholder mb-3">
                {project.media.map((item, mediaIndex) => (
                    <div
                        key={mediaIndex}
                        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                            mediaIndex === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {item.type === 'video' ? (
                            <video
                                src={item.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                        ) : (
                            <img
                                src={item.src}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                        )}
                    </div>
                ))}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-500" />

                {/* Carousel indicators */}
                {project.media.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {project.media.map((_, dotIndex) => (
                            <div
                                key={dotIndex}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    dotIndex === currentIndex
                                        ? 'bg-white'
                                        : 'bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
            <span
                className="font-serif text-lg text-foreground uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-playfair)' }}
            >
                {project.title}
            </span>
            <p className="font-sans text-sm text-foreground/60 mt-1">
                {project.subtitle}
            </p>
        </motion.div>
    );
}

export function WorkGrid({ projects }: WorkGridProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const expandedProject = projects.find(p => p.id === expandedId);
    const expandedIndex = projects.findIndex(p => p.id === expandedId);

    const handleNext = useCallback(() => {
        if (expandedIndex < projects.length - 1) {
            setExpandedId(projects[expandedIndex + 1].id);
        }
    }, [expandedIndex, projects]);

    const handlePrev = useCallback(() => {
        if (expandedIndex > 0) {
            setExpandedId(projects[expandedIndex - 1].id);
        }
    }, [expandedIndex, projects]);

    // Lock body scroll when carousel is open
    useEffect(() => {
        if (expandedId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [expandedId]);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
                {projects.map((project, index) => (
                    <GridItem
                        key={project.id}
                        project={project}
                        index={index}
                        onClick={() => setExpandedId(project.id)}
                    />
                ))}
            </div>

            {/* Floating carousel overlay */}
            <AnimatePresence>
                {expandedProject && (
                    <FloatingCarousel
                        project={expandedProject}
                        onClose={() => setExpandedId(null)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        hasNext={expandedIndex < projects.length - 1}
                        hasPrev={expandedIndex > 0}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

// Grid icon - 4 squares
const GridIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
        <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

// Flow icon - stacked horizontal bars
const FlowIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
        <rect x="1" y="2" width="16" height="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="7.5" width="16" height="3" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="13" width="16" height="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

// View toggle component
interface ViewToggleProps {
    view: 'grid' | 'flow';
    onViewChange: (view: 'grid' | 'flow') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => onViewChange('grid')}
                className={`p-2 transition-all duration-500 ease-out ${view === 'grid' ? 'text-foreground' : 'text-foreground/30 hover:text-foreground/60'
                    }`}
                aria-label="Grid view"
            >
                <GridIcon />
            </button>
            <button
                onClick={() => onViewChange('flow')}
                className={`p-2 transition-all duration-500 ease-out ${view === 'flow' ? 'text-foreground' : 'text-foreground/30 hover:text-foreground/60'
                    }`}
                aria-label="Flow view"
            >
                <FlowIcon />
            </button>
        </div>
    );
}
