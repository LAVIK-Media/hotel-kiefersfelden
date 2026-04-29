import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

/**
 * KERN-FEATURE: Speisekarte.
 *
 * Drei Verwendungsmuster werden über das Feld `type` gesteuert:
 *
 * 1. „tageskarte"     — eine bestimmte Tageskarte. Pflichtfeld: `date`.
 *                       Frontend-Auswahl: höchstes `date` ≤ heute gewinnt.
 *
 * 2. „wochenkarte"    — gilt von `validFrom` bis `validUntil`.
 *                       Frontend-Auswahl: aktiver Zeitraum gewinnt.
 *
 * 3. „standardkarte"  — die Hauskarte. Kein Datum nötig — gilt dauerhaft.
 *    / „saisonkarte"     Saisonkarte: Spargelkarte, Wildkarte, Schlachtfest.
 *
 * Die Frontend-Logik in `lib/queries.ts` (ACTIVE_MENU_QUERY) wählt
 * automatisch die passende Karte ohne Eingriff der Editorin.
 */
export const menu = defineType({
  name: 'menu',
  title: 'Speisekarte',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'kopf', title: 'Kopfdaten', default: true },
    { name: 'inhalt', title: 'Karten-Inhalt' },
    { name: 'sichtbarkeit', title: 'Sichtbarkeit' },
  ],
  fields: [
    // ───────────────────────────────  Kopfdaten  ───────────────────────────
    defineField({
      name: 'type',
      title: 'Karten-Typ',
      group: 'kopf',
      type: 'string',
      options: {
        list: [
          { title: 'Tageskarte (für ein bestimmtes Datum)', value: 'tageskarte' },
          { title: 'Wochenkarte (Zeitraum)', value: 'wochenkarte' },
          { title: 'Standardkarte (immer gültig)', value: 'standardkarte' },
          { title: 'Saisonkarte (Spargel, Wild, Schlachtfest …)', value: 'saisonkarte' },
        ],
        layout: 'radio',
      },
      initialValue: 'tageskarte',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      group: 'kopf',
      description:
        'Wird als Überschrift im Frontend angezeigt. Beispiel: „Mittagskarte 27.04.", „Schlachtfestwoche 2026", „Spargelkarte Frühling".',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de || de.trim().length === 0) return 'Titel (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      group: 'kopf',
      description:
        'NUR für Tageskarten ausfüllen. Das Frontend zeigt automatisch die Karte mit dem höchsten Datum, das ≤ heute liegt.',
      type: 'date',
      hidden: ({ document }) => document?.type !== 'tageskarte',
      validation: (Rule) =>
        Rule.custom((value, { document }) => {
          if (document?.type === 'tageskarte' && !value) {
            return 'Datum ist bei Tageskarten Pflicht.'
          }
          return true
        }),
    }),
    defineField({
      name: 'validFrom',
      title: 'Gültig ab',
      group: 'kopf',
      type: 'date',
      hidden: ({ document }) =>
        document?.type !== 'wochenkarte' && document?.type !== 'saisonkarte',
      validation: (Rule) =>
        Rule.custom((value, { document }) => {
          const t = document?.type
          if ((t === 'wochenkarte' || t === 'saisonkarte') && !value) {
            return '„Gültig ab" ist bei Wochen- und Saisonkarten Pflicht.'
          }
          return true
        }),
    }),
    defineField({
      name: 'validUntil',
      title: 'Gültig bis',
      group: 'kopf',
      type: 'date',
      hidden: ({ document }) =>
        document?.type !== 'wochenkarte' && document?.type !== 'saisonkarte',
      validation: (Rule) =>
        Rule.custom((value, { document }) => {
          const t = document?.type
          if ((t === 'wochenkarte' || t === 'saisonkarte') && !value) {
            return '„Gültig bis" ist bei Wochen- und Saisonkarten Pflicht.'
          }
          if (
            value &&
            document?.validFrom &&
            new Date(value as string) < new Date(document.validFrom as string)
          ) {
            return '„Gültig bis" muss nach „Gültig ab" liegen.'
          }
          return true
        }),
    }),
    defineField({
      name: 'introNote',
      title: 'Einleitungs-Hinweis',
      group: 'kopf',
      description:
        'Erscheint oberhalb der Karten-Sektionen. Z.B. „Diese Woche bei uns: frischer Spargel aus Schrobenhausen".',
      type: 'internationalizedArrayText',
    }),

    // ───────────────────────────────  Inhalt  ──────────────────────────────
    defineField({
      name: 'sections',
      title: 'Sektionen (Vorspeisen, Hauptgang, Dessert …)',
      group: 'inhalt',
      type: 'array',
      of: [{ type: 'menuSection' }],
      validation: (Rule) =>
        Rule.required().min(1).error('Mindestens 1 Sektion pro Karte.'),
    }),
    defineField({
      name: 'footerNote',
      title: 'Hinweis-Text unten',
      group: 'inhalt',
      description:
        'Erscheint am Ende der Karte. Üblich: „Alle Preise in EUR. Allergene auf Anfrage." oder die Allergen-Legende.',
      type: 'internationalizedArrayText',
    }),

    // ─────────────────────────────  Sichtbarkeit  ─────────────────────────
    defineField({
      name: 'isPublished',
      title: 'Veröffentlicht?',
      group: 'sichtbarkeit',
      description:
        'Solange ausgeschaltet, wird die Karte nicht im Frontend angezeigt. Nutzbar zum Vorbereiten der Karte für morgen.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
      date: 'date',
      from: 'validFrom',
      to: 'validUntil',
      published: 'isPublished',
      sections: 'sections',
    },
    prepare({ type, title, date, from, to, published, sections }) {
      const de = (title as Array<{ _key: string; value?: string }> | undefined)?.find(
        (t) => t._key === 'de',
      )?.value
      const typeLabel = ({
        tageskarte: 'Tageskarte',
        wochenkarte: 'Wochenkarte',
        standardkarte: 'Standardkarte',
        saisonkarte: 'Saisonkarte',
      } as Record<string, string>)[type as string]
      const period =
        type === 'tageskarte'
          ? date
          : (from || to)
            ? `${from ?? '?'} – ${to ?? '?'}`
            : ''
      const sectionCount = Array.isArray(sections) ? sections.length : 0
      const status = published ? '✓ veröffentlicht' : '⏳ Entwurf'
      return {
        title: de || '(Ohne Titel)',
        subtitle: [typeLabel, period, `${sectionCount} Sektion(en)`, status]
          .filter(Boolean)
          .join('  ·  '),
      }
    },
  },
  orderings: [
    {
      title: 'Datum (neueste zuerst)',
      name: 'dateDesc',
      by: [
        { field: 'date', direction: 'desc' },
        { field: 'validFrom', direction: 'desc' },
      ],
    },
    {
      title: 'Karten-Typ',
      name: 'type',
      by: [
        { field: 'type', direction: 'asc' },
        { field: 'date', direction: 'desc' },
      ],
    },
  ],
})
