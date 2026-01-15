import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.type !== 'image',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Vimeo or external video URL',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Or upload a video file directly',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'isLandscape',
      title: 'Landscape Format',
      type: 'boolean',
      description: 'Check for 16:9 aspect ratio (landscape). Uncheck for 3:4 (portrait).',
      initialValue: false,
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      image: 'image',
      isLandscape: 'isLandscape',
    },
    prepare({ type, image, isLandscape }) {
      return {
        title: `${type === 'video' ? 'Video' : 'Image'} - ${isLandscape ? 'Landscape' : 'Portrait'}`,
        media: image,
      };
    },
  },
});
