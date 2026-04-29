import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social-Media-Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Plattform',
      type: 'string',
      options: {
        list: [
          { title: 'Facebook', value: 'facebook' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'HolidayCheck', value: 'holidaycheck' },
          { title: 'TripAdvisor', value: 'tripadvisor' },
          { title: 'Google Maps', value: 'googlemaps' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({ allowRelative: false, scheme: ['https'] }),
    }),
  ],
  preview: {
    select: { platform: 'platform', url: 'url' },
    prepare({ platform, url }) {
      return { title: platform as string, subtitle: url as string }
    },
  },
})
