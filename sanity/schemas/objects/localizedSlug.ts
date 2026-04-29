import { defineField, defineType } from 'sanity'

/**
 * Slug-Set pro Sprache.
 * DE-Slug ist Pflicht, EN optional (kann später nachgereicht werden).
 *
 * Im Frontend mappt /<de-slug>/ → DE-Variante, /en/<en-slug>/ → EN-Variante.
 */
export const localizedSlug = defineType({
  name: 'localizedSlug',
  title: 'URL-Pfad',
  type: 'object',
  fields: [
    defineField({
      name: 'de',
      title: 'URL-Pfad (Deutsch)',
      type: 'slug',
      options: {
        // Auto-Slug aus dem DE-Eintrag des Geschwister-Felds `name` oder `title`.
        // Funktioniert für Document-Types, deren Hauptbezeichnung in einem
        // dieser zwei Felder als internationalizedArray liegt.
        source: (doc) => {
          const d = doc as Record<string, unknown>
          const candidates = [d.name, d.title].filter(Array.isArray) as Array<
            Array<{ _key: string; value?: string }>
          >
          for (const arr of candidates) {
            const de = arr.find((entry) => entry._key === 'de')?.value
            if (de) return de
          }
          return ''
        },
        maxLength: 80,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/ä/g, 'ae')
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80),
      },
      validation: (Rule) => Rule.required().error('DE-URL-Pfad ist Pflicht.'),
    }),
    defineField({
      name: 'en',
      title: 'URL-Pfad (Englisch)',
      type: 'slug',
      options: {
        maxLength: 80,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80),
      },
    }),
  ],
})
