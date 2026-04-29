import { defineField, defineType } from 'sanity'
import { OlistIcon } from '@sanity/icons'

/**
 * Eine Sektion innerhalb einer Speisekarte: „Vorspeisen", „Hauptgang",
 * „Desserts", „Schmankerl der Schlachtfestwoche".
 */
export const menuSection = defineType({
  name: 'menuSection',
  title: 'Karten-Sektion',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Sektionsname',
      description: 'z.B. „Vorspeisen", „Hauptspeisen", „Aus der Pfanne", „Desserts".',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Sektionsname (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'note',
      title: 'Sektions-Hinweis (optional)',
      description: 'Wird unter dem Sektionstitel angezeigt. Z.B. „Alle Preise inkl. Beilage".',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'items',
      title: 'Einträge',
      description:
        'Wiederverwendbare Klassiker als Referenz aus dem Bereich „Standard-Gerichte" wählen, einmalige Spezialitäten direkt hier einfügen.',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'menuItem' }], title: 'Wiederverwendbares Gericht' },
        { type: 'inlineMenuItem' },
      ],
      validation: (Rule) => Rule.min(1).error('Mindestens 1 Eintrag pro Sektion.'),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      items: 'items',
    },
    prepare({ name, items }) {
      const de = (name as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: de || 'Sektion',
        subtitle: `${count} ${count === 1 ? 'Eintrag' : 'Einträge'}`,
      }
    },
  },
})
