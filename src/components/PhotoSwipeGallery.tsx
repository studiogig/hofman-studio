'use client';

import { useEffect, useRef } from 'react';

type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  thumbnail?: string;
  title?: string;
};

type PhotoSwipeGalleryProps = {
  items: GalleryItem[];
  galleryId: string;
  children: (item: GalleryItem, index: number) => React.ReactNode;
  className?: string;
};

export function PhotoSwipeGallery({ items, galleryId, children, className }: PhotoSwipeGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<any>(null);

  useEffect(() => {
    let lightbox: any = null;

    const initPhotoSwipe = async () => {
      const PhotoSwipeLightbox = (await import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.js' as any)).default;
      const PhotoSwipe = (await import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.js' as any)).default;

      lightbox = new PhotoSwipeLightbox({
        gallery: `#${galleryId}`,
        children: 'a',
        pswpModule: PhotoSwipe,
        // Default options for smooth experience
        bgOpacity: 1,
        showHideAnimationType: 'fade',
        zoom: true,
        pinchToClose: true,
        closeOnVerticalDrag: true,
      });

      lightbox.init();
      lightboxRef.current = lightbox;
    };

    initPhotoSwipe();

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [galleryId]);

  return (
    <div id={galleryId} ref={galleryRef} className={className}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.src}
          data-pswp-width={item.width}
          data-pswp-height={item.height}
          target="_blank"
          rel="noreferrer"
        >
          {children(item, index)}
        </a>
      ))}
    </div>
  );
}

// Simple gallery that just wraps existing content with PhotoSwipe functionality
type SimplePhotoSwipeProps = {
  galleryId: string;
  children: React.ReactNode;
};

export function SimplePhotoSwipe({ galleryId, children }: SimplePhotoSwipeProps) {
  const lightboxRef = useRef<any>(null);

  useEffect(() => {
    let lightbox: any = null;

    const initPhotoSwipe = async () => {
      try {
        const PhotoSwipeLightbox = (await import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe-lightbox.esm.js' as any)).default;
        const PhotoSwipe = (await import('https://cdn.jsdelivr.net/npm/photoswipe@5.4.4/dist/photoswipe.esm.js' as any)).default;

        lightbox = new PhotoSwipeLightbox({
          gallery: `#${galleryId}`,
          children: 'a[data-pswp-width]',
          pswpModule: PhotoSwipe,
          bgOpacity: 1,
          showHideAnimationType: 'fade',
          zoom: true,
          pinchToClose: true,
          closeOnVerticalDrag: true,
        });

        lightbox.init();
        lightboxRef.current = lightbox;
      } catch (err) {
        console.error('Failed to load PhotoSwipe:', err);
      }
    };

    initPhotoSwipe();

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [galleryId]);

  return (
    <div id={galleryId}>
      {children}
    </div>
  );
}
