import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Manuell pflegbarer HolidayCheck-Score.
 *
 * Empfehlung an die Inhaberfamilie:
 *   – Für die ersten Monate manuell pflegen (1× pro Monat aktualisieren).
 *   – Mittelfristig kann ein Cron-Job auf dem Vercel-Frontend den Score
 *     vom HolidayCheck-Profil scrapen und via API hier zurückschreiben
 *     (HolidayCheck hat keine offene API). Diese Automatisierung ist
 *     Phase-3-Thema, nicht Schema-Thema.
 */
export const holidayCheckScore = defineType({
  name: 'holidayCheckScore',
  title: 'HolidayCheck-Bewertung',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'score',
      title: 'Bewertung (0–6)',
      type: 'number',
      description: 'Aktueller Durchschnitts-Score auf HolidayCheck.',
      validation: (Rule) => Rule.min(0).max(6).precision(1),
    }),
    defineField({
      name: 'recommendationRate',
      title: 'Weiterempfehlungs-Quote (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Anzahl Bewertungen',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'profileUrl',
      title: 'Link zum HolidayCheck-Profil',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Zuletzt aktualisiert',
      type: 'date',
    }),
    defineField({
      name: 'badges',
      title: 'Auszeichnungs-Jahre',
      description: 'Liste der Jahre, in denen das Hotel ausgezeichnet wurde (z.B. 2024, 2025, 2026).',
      type: 'array',
      of: [{ type: 'number' }],
      options: { layout: 'tags' },
    }),
  ],
})
