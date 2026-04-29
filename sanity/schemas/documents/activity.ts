import { defineField, defineType } from 'sanity'
import { CompassIcon } from '@sanity/icons'

export const activity = defineType({
  name: 'activity',
  title: 'Aktivität / Region',
  type: 'document',
  icon: CompassIcon,
  description:
    'Wandern, Skifahren, Sehenswürdigkeiten, Kutschenfahrt, Hocheck etc. Eine Karte pro Aktivität — wird auf den Saisonseiten und auf /erleben/ angezeigt.',
  groups: [
    { name: 'beschreibung', title: 'Beschreibung', default: true },
    { name: 'fakten', title: 'Fakten' },
    { name: 'medien', title: 'Bilder' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      group: 'beschreibung',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Titel (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Pfad',
      group: 'beschreibung',
      type: 'localizedSlug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Kurzbeschreibung',
      group: 'beschreibung',
      type: 'internationalizedArrayText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Ausführliche Beschreibung',
      group: 'beschreibung',
      type: 'localizedPortableText',
    }),
    defineField({
      name: 'seasons',
      title: 'Saison-Eignung',
      group: 'fakten',
      description: 'Mehrfachauswahl. Bestimmt, auf welchen Saison-Seiten die Aktivität auftaucht.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Frühling', value: 'spring' },
          { title: 'Sommer', value: 'summer' },
          { title: 'Herbst', value: 'autumn' },
          { title: 'Winter', value: 'winter' },
        ],
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      group: 'fakten',
      type: 'string',
      options: {
        list: [
          { title: 'Wandern', value: 'hiking' },
          { title: 'Bergsteigen', value: 'mountaineering' },
          { title: 'Radfahren', value: 'cycling' },
          { title: 'Skifahren / Snowboard', value: 'ski' },
          { title: 'Langlauf', value: 'crosscountry' },
          { title: 'Rodeln', value: 'sledding' },
          { title: 'Kutschenfahrt', value: 'carriage' },
          { title: 'Sehenswürdigkeit', value: 'sight' },
          { title: 'Kultur / Brauchtum', value: 'culture' },
          { title: 'Kulinarik', value: 'culinary' },
          { title: 'Wellness / Bad', value: 'wellness' },
          { title: 'Sonstiges', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'distanceKm',
      title: 'Entfernung vom Hotel (km)',
      group: 'fakten',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(500),
    }),
    defineField({
      name: 'duration',
      title: 'Dauer',
      group: 'fakten',
      description: 'z.B. „2 h", „halber Tag", „ganzer Tag".',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'difficulty',
      title: 'Schwierigkeit',
      group: 'fakten',
      type: 'string',
      options: {
        list: [
          { title: 'Leicht', value: 'easy' },
          { title: 'Mittel', value: 'medium' },
          { title: 'Schwer', value: 'hard' },
          { title: 'Familienfreundlich', value: 'family' },
        ],
      },
    }),
    defineField({
      name: 'externalUrl',
      title: 'Externer Link',
      group: 'fakten',
      description: 'Z.B. zur offiziellen Tourismus-Region oder GPX-Datei.',
      type: 'url',
    }),
    defineField({
      name: 'gallery',
      title: 'Bildergalerie',
      group: 'medien',
      type: 'array',
      of: [{ type: 'richImage' }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'orderRank',
      title: 'Sortier-Reihenfolge',
      group: 'beschreibung',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      group: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      cat: 'category',
      seasons: 'seasons',
      gallery: 'gallery',
    },
    prepare({ title, cat, seasons, gallery }) {
      const de = (title as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      const first = Array.isArray(gallery) ? gallery[0] : undefined
      const seasonStr = Array.isArray(seasons) ? (seasons as string[]).join(', ') : ''
      return {
        title: de || '(Ohne Titel)',
        subtitle: `${cat ?? '—'}  ·  ${seasonStr || '—'}`,
        media: first as never,
      }
    },
  },
})
