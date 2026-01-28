'use client';

import { useEffect, useRef } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

type GalleryImage = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  title?: string;
};

type PhotoSwipeGalleryProps = {
  galleryId: string;
  images: GalleryImage[];
  className?: string;
  renderItem: (image: GalleryImage, index: number) => React.ReactNode;
};

export function PhotoSwipeGallery({ galleryId, images, className, renderItem }: PhotoSwipeGalleryProps) {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: 'a[data-pswp-width]',
      pswpModule: () => import('photoswipe'),
      // Options
      bgOpacity: 1,
      showHideAnimationType: 'fade',
      zoom: true,
      pinchToClose: false,
      closeOnVerticalDrag: false,
      clickToCloseNonZoomable: false,
      tapAction: 'zoom',
      padding: { top: 80, bottom: 80, left: 20, right: 20 },
    });

    lightbox.init();
    lightboxRef.current = lightbox;

    return () => {
      lightbox.destroy();
      lightboxRef.current = null;
    };
  }, [galleryId]);

  return (
    <div id={galleryId} className={className}>
      {images.map((image, index) => (
        <a
          key={index}
          href={image.src}
          data-pswp-width={image.width}
          data-pswp-height={image.height}
          target="_blank"
          rel="noreferrer"
          className="block"
        >
          {renderItem(image, index)}
        </a>
      ))}
    </div>
  );
}

// Hook to initialize PhotoSwipe on an existing gallery element
export function usePhotoSwipe(galleryId: string, enabled: boolean = true) {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const lightbox = new PhotoSwipeLightbox({
        gallery: `#${galleryId}`,
        children: 'a[data-pswp-width]',
        pswpModule: () => import('photoswipe'),
        bgOpacity: 1,
        showHideAnimationType: 'fade',
        zoom: true,
        pinchToClose: false,
        closeOnVerticalDrag: false,
        clickToCloseNonZoomable: false,
        tapAction: 'zoom',
        padding: { top: 80, bottom: 80, left: 20, right: 20 },
      });

      lightbox.init();
      lightboxRef.current = lightbox;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, [galleryId, enabled]);

  return lightboxRef;
}
