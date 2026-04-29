import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Gästestimme',
  type: 'document',
  icon: CommentIcon,
  description:
    'Manuell gepflegte Gästezitate (Ergänzung zum HolidayCheck-Widget). Vor Veröffentlichung Einverständnis des Gastes einholen.',
  fields: [
    defineField({
      name: 'quote',
      title: 'Zitat',
      type: 'internationalizedArrayText',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Zitat (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'authorName',
      title: 'Autor:in',
      description: 'Vorname + Initiale empfohlen, z.B. „Familie Bauer, M.".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorLocation',
      title: 'Herkunftsort (optional)',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Bewertung (1–5 Sterne)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: 'source',
      title: 'Quelle',
      type: 'string',
      options: {
        list: [
          { title: 'HolidayCheck', value: 'holidaycheck' },
          { title: 'Google', value: 'google' },
          { title: 'TripAdvisor', value: 'tripadvisor' },
          { title: 'Booking.com', value: 'booking' },
          { title: 'Direkt eingeholt', value: 'direct' },
          { title: 'Sonstige', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Datum der Bewertung',
      type: 'date',
    }),
    defineField({
      name: 'consentObtained',
      title: 'Einverständnis liegt vor',
      description: 'Bestätigung, dass der Gast der Veröffentlichung zugestimmt hat.',
      type: 'boolean',
      initialValue: false,
      validation: (Rule) =>
        Rule.custom((value, { document }) => {
          if (document?.isPublished && !value) {
            return 'Vor Veröffentlichung muss das Einverständnis vorliegen.'
          }
          return true
        }),
    }),
    defineField({
      name: 'isPublished',
      title: 'Veröffentlicht?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'orderRank',
      title: 'Sortier-Reihenfolge',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      author: 'authorName',
      location: 'authorLocation',
      rating: 'rating',
      published: 'isPublished',
      quote: 'quote',
    },
    prepare({ author, location, rating, published, quote }) {
      const de = (quote as Array<{ _key: string; value?: string }> | undefined)?.find(
        (q) => q._key === 'de',
      )?.value
      const stars = rating ? '★'.repeat(rating as number) : ''
      const status = published ? '✓' : '⏳'
      return {
        title: `${author ?? '?'}${location ? ` · ${location}` : ''}`,
        subtitle: `${status}  ${stars}${stars ? '  ·  ' : ''}${(de as string)?.slice(0, 60) ?? ''}…`,
      }
    },
  },
})
