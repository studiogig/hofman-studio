import { groq } from 'next-sanity';

// Get all work projects
export const workProjectsQuery = groq`
  *[_type == "project" && category == "work"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    order,
    media[] {
      type,
      isLandscape,
      alt,
      image {
        asset-> {
          _id,
          url
        },
        hotspot
      },
      videoUrl,
      "videoFileUrl": videoFile.asset->url
    }
  }
`;

// Get all research projects
export const researchProjectsQuery = groq`
  *[_type == "project" && category == "research"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    order,
    media[] {
      type,
      isLandscape,
      alt,
      image {
        asset-> {
          _id,
          url
        },
        hotspot
      },
      videoUrl,
      "videoFileUrl": videoFile.asset->url
    }
  }
`;

// Get site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    studioName,
    tagline,
    email,
    instagram,
    instagramUrl,
    infoSections[] {
      title,
      content
    },
    introImages[] {
      asset-> {
        _id,
        url
      }
    }
  }
`;
