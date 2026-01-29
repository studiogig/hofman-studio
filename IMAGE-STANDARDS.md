# Image Standards for Hofman Studio Website

## Planned Implementation

### 1. Base Image Resolutions (2x Retina)
- **Portrait (3:4)**: 2400 × 3200px
- **Landscape (16:9)**: 3200 × 1800px

### 2. Why These Sizes
- Carousel displays at ~800px height → needs 1600px for 2x retina
- Extra resolution supports PhotoSwipe zoom (up to 4x configured)
- Consistent aspect ratios across all work

### 3. Code Changes Planned
- Switch from native `<img>` to Next.js `<Image>` component
- Automatic WebP/AVIF conversion
- Responsive srcset generation
- Lazy loading built-in

### 4. Export Workflow
- All stills exported at fixed dimensions above
- JPG quality: 85-90%
- Color profile: sRGB for web

### 5. Current State
- Using native `<img>` tags
- No automatic optimization
- Mixed image sizes in /public/images/

---

**Status**: Planning phase - ready to implement when images are standardized
