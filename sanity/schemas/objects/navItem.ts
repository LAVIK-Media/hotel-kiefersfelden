import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

/**
 * Ein Navigations-Eintrag (Header oder Footer).
 *
 * `internalLink` und `externalUrl` schließen sich gegenseitig aus —
 * wird per Validation geprüft.
 */
export const navItem = defineType({
  name: 'navItem',
  title: 'Menüpunkt',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Beschriftung',
      description: 'Wie der Menüpunkt im Browser angezeigt wird.',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Beschriftung (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'internalLink',
      title: 'Interner Link',
      description: 'Verweis auf eine Seite im eigenen Studio.',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'room' },
        { type: 'offer' },
        { type: 'activity' },
      ],
    }),
    defineField({
      name: 'externalUrl',
      title: 'Externer Link',
      description: 'Nur ausfüllen, wenn der Link auf eine fremde Website zeigt (z.B. DIRS21-Buchung).',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ scheme: ['http', 'https'], allowRelative: false }),
    }),
    defineField({
      name: 'children',
      title: 'Untermenü-Punkte',
      description: 'Optional, eine Ebene tief.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'subNavItem',
          fields: [
            {
              name: 'label',
              title: 'Beschriftung',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'internalLink',
              title: 'Interner Link',
              type: 'reference',
              to: [
                { type: 'page' },
                { type: 'room' },
                { type: 'offer' },
                { type: 'activity' },
              ],
            },
            {
              name: 'externalUrl',
              title: 'Externer Link',
              type: 'url',
            },
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }) {
              const de = (label as Array<{ _key: string; value?: string }> | undefined)?.find(
                (v) => v._key === 'de',
              )?.value
              return { title: de || '(Ohne Beschriftung)' }
            },
          },
        },
      ],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const v = value as { internalLink?: unknown; externalUrl?: string } | undefined
      if (!v) return true
      if (v.internalLink && v.externalUrl) {
        return 'Bitte entweder internen Link ODER externen Link wählen, nicht beides.'
      }
      if (!v.internalLink && !v.externalUrl) {
        return 'Bitte einen Link auswählen (intern oder extern).'
      }
      return true
    }),
  preview: {
    select: { label: 'label', children: 'children' },
    prepare({ label, children }) {
      const de = (label as Array<{ _key: string; value?: string }> | undefined)?.find(
        (v) => v._key === 'de',
      )?.value
      const count = Array.isArray(children) ? children.length : 0
      return {
        title: de || '(Ohne Beschriftung)',
        subtitle: count > 0 ? `+ ${count} Untermenü-Punkte` : undefined,
      }
    },
  },
})
