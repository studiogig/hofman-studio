'use client';

import { useState, useEffect } from 'react';
import { getWorkProjects, getResearchProjects, getSiteSettings, transformCMSProject, transformCMSSettings } from '../../sanity/lib/fetch';

// Check if we should use CMS
const USE_CMS = process.env.NEXT_PUBLIC_USE_CMS === 'true';

// Dev mode data (current hardcoded content)
const DEV_WORK_PROJECTS = [
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
      { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video" as const, isLandscape: true },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4", type: "video" as const, isLandscape: false },
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
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg", type: "image" as const, isLandscape: false },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg", type: "image" as const, isLandscape: false },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video" as const, isLandscape: false },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video" as const, isLandscape: false },
    ],
  },
];

const DEV_RESEARCH_PROJECTS: typeof DEV_WORK_PROJECTS = [];

const DEV_INFO_CONTENT = [
  { title: 'About', content: 'Hofman Studio is a production practice applying material intelligence to luxury brands. We direct AI-native workflows for spirits, beauty, and fragrance, combining 15 years of photography and film expertise with emerging production technologies.' },
  { title: 'Approach', content: 'Every project begins with material study. We understand how light interacts with glass, how liquids move, how surfaces reflect. This physical understanding informs how we direct AI tools to achieve craft-quality results at production speed.' },
  { title: 'Services', content: 'Product photography direction\nMotion and film\nConcept development\nAI workflow consulting' },
];

const DEV_CONTACT = {
  email: 'hello@hofman.studio',
  instagram: '@hofman.studio',
  instagramUrl: 'https://instagram.com/hofman.studio',
};

const DEV_INTRO_IMAGES = [
  { src: '/images/Watch report/freepik__enhance__46843.jpg', type: 'image' as const },
  { src: '/images/Merit/freepik__enhance__74134.jpg', type: 'image' as const },
  { src: '/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg', type: 'image' as const },
  { src: '/images/Watch report/freepik__enhance__73551.jpg', type: 'image' as const },
  { src: '/images/Merit/SH_t9w9cp.jpg', type: 'image' as const },
  { src: '/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg', type: 'image' as const },
  { src: '/images/Watch report/freepik__enhance__83979.jpg', type: 'image' as const },
  { src: '/images/Watch report/freepik__enhance__83980.jpg', type: 'image' as const },
];

// Types
export interface Project {
  id: string;
  title: string;
  media: {
    src: string;
    type: 'image' | 'video';
    isLandscape: boolean;
  }[];
}

export interface InfoItem {
  title: string;
  content: string;
}

export interface ContactInfo {
  email: string;
  instagram: string;
  instagramUrl: string;
}

export interface IntroImage {
  src: string;
  type: 'image' | 'video';
}

// Hook to get all content
export function useContent() {
  const [workProjects, setWorkProjects] = useState<Project[]>(DEV_WORK_PROJECTS);
  const [researchProjects, setResearchProjects] = useState<Project[]>(DEV_RESEARCH_PROJECTS);
  const [infoContent, setInfoContent] = useState<InfoItem[]>(DEV_INFO_CONTENT);
  const [contact, setContact] = useState<ContactInfo>(DEV_CONTACT);
  const [introImages, setIntroImages] = useState<IntroImage[]>(DEV_INTRO_IMAGES);
  const [isLoading, setIsLoading] = useState(USE_CMS);

  useEffect(() => {
    if (!USE_CMS) {
      setIsLoading(false);
      return;
    }

    async function fetchContent() {
      try {
        const [workData, researchData, settingsData] = await Promise.all([
          getWorkProjects(),
          getResearchProjects(),
          getSiteSettings(),
        ]);

        if (workData?.length > 0) {
          setWorkProjects(workData.map(transformCMSProject));
        }

        if (researchData?.length > 0) {
          setResearchProjects(researchData.map(transformCMSProject));
        }

        const transformedSettings = transformCMSSettings(settingsData);
        if (transformedSettings) {
          if (transformedSettings.infoContent?.length > 0) {
            setInfoContent(transformedSettings.infoContent);
          }
          setContact(transformedSettings.contact);
          if (transformedSettings.introImages?.length > 0) {
            setIntroImages(transformedSettings.introImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch CMS content, using dev data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, []);

  return {
    workProjects,
    researchProjects,
    infoContent,
    contact,
    introImages,
    isLoading,
    useCMS: USE_CMS,
  };
}
