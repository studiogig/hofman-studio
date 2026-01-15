'use client';

import { useState, useEffect } from 'react';

// Breakpoint for mobile/tablet detection (matches Tailwind's md breakpoint)
// Below 768px = mobile, at or above 768px = desktop (includes iPad landscape)
const MOBILE_BREAKPOINT = 768;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();
    setIsLoaded(true);

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isLoaded };
};
