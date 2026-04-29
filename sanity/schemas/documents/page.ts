import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

/**
 * Generische Inhaltsseite — für Texte, die kein eigenes Schema brauchen.
 *
 * Geeignet für: Impressum, Datenschutz, AGB, Über uns / Geschichte,
 * Karriere, Pressebereich. Auch für Zusatz-Landingpages.
 */
export const page = defineType({
  name: 'page',
  title: 'Seite',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'inhalt', title: 'Inhalt', default: true },
    { name: 'medien', title: 'Bild' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      group: 'inhalt',
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
      group: 'inhalt',
      type: 'localizedSlug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Seitentyp',
      group: 'inhalt',
      description:
        'Markiert Sonder-Seiten (Impressum, Datenschutz, AGB), die im Footer und Schema.org speziell behandelt werden.',
      type: 'string',
      options: {
        list: [
          { title: 'Standard-Inhaltsseite', value: 'standard' },
          { title: 'Impressum', value: 'imprint' },
          { title: 'Datenschutz', value: 'privacy' },
          { title: 'AGB / Stornobedingungen', value: 'terms' },
          { title: 'Über uns / Geschichte', value: 'about' },
          { title: 'Karriere / Jobs', value: 'careers' },
        ],
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'leadText',
      title: 'Lead-Text (optional)',
      group: 'inhalt',
      description: 'Erscheint groß unter der Überschrift.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      group: 'inhalt',
      type: 'localizedPortableText',
    }),
    defineField({
      name: 'heroImage',
      title: 'Titelbild (optional)',
      group: 'medien',
      type: 'richImage',
    }),
    defineField({
      name: 'lastReviewedAt',
      title: 'Zuletzt rechtlich geprüft am',
      group: 'inhalt',
      description: 'Nur bei Impressum / Datenschutz / AGB ausfüllen.',
      type: 'date',
      hidden: ({ document }) =>
        !['imprint', 'privacy', 'terms'].includes(document?.pageType as string),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      group: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', pageType: 'pageType', slug: 'slug.de.current' },
    prepare({ title, pageType, slug }) {
      const de = (title as Array<{ _key: string; value?: string }> | undefined)?.find(
        (t) => t._key === 'de',
      )?.value
      return {
        title: de || '(Ohne Titel)',
        subtitle: `${pageType ?? '—'}${slug ? `  ·  /${slug}/` : ''}`,
      }
    },
  },
})
