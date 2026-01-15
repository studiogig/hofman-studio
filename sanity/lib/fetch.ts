import { client } from './client';
import { workProjectsQuery, researchProjectsQuery, siteSettingsQuery } from './queries';

// Types for CMS data
export interface CMSMediaItem {
  type: 'image' | 'video';
  isLandscape: boolean;
  alt?: string;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  videoUrl?: string;
  videoFileUrl?: string;
}

export interface CMSProject {
  _id: string;
  title: string;
  slug: string;
  category: 'work' | 'research';
  order: number;
  media: CMSMediaItem[];
}

export interface CMSSiteSettings {
  studioName: string;
  tagline: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  infoSections: {
    title: string;
    content: string;
  }[];
  introImages: {
    asset: {
      _id: string;
      url: string;
    };
  }[];
}

// Fetch functions
export async function getWorkProjects(): Promise<CMSProject[]> {
  return client.fetch(workProjectsQuery);
}

export async function getResearchProjects(): Promise<CMSProject[]> {
  return client.fetch(researchProjectsQuery);
}

export async function getSiteSettings(): Promise<CMSSiteSettings | null> {
  return client.fetch(siteSettingsQuery);
}

// Transform CMS data to match current app format
export function transformCMSProject(project: CMSProject) {
  return {
    id: project.slug || project._id,
    title: project.title,
    media: project.media?.map((item) => ({
      src: item.type === 'image'
        ? item.image?.asset?.url || ''
        : item.videoUrl || item.videoFileUrl || '',
      type: item.type,
      isLandscape: item.isLandscape || false,
    })) || [],
  };
}

export function transformCMSSettings(settings: CMSSiteSettings | null) {
  if (!settings) return null;

  return {
    studioName: settings.studioName,
    tagline: settings.tagline,
    contact: {
      email: settings.email,
      instagram: settings.instagram,
      instagramUrl: settings.instagramUrl,
    },
    infoContent: settings.infoSections?.map((section) => ({
      title: section.title,
      content: section.content,
    })) || [],
    introImages: settings.introImages?.map((img) => ({
      src: img.asset?.url || '',
      type: 'image' as const,
    })) || [],
  };
}
