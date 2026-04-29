import { defineArrayMember, defineType } from 'sanity'

/**
 * Lokalisierter Portable-Text-Block.
 *
 * Da `internationalizedArray` nur `string` und `text` als Feldtypen unterstützt,
 * verwenden wir für mehrsprachigen Rich-Text einen Wrapper-Array mit DE/EN-Keys
 * und je einem `array` of blocks pro Sprache. Im Studio sieht die Editorin
 * Reiter „DE" und „EN" nebeneinander.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Inhalts-Block',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Absatz', value: 'normal' },
        { title: 'Überschrift 2', value: 'h2' },
        { title: 'Überschrift 3', value: 'h3' },
        { title: 'Überschrift 4', value: 'h4' },
        { title: 'Zitat', value: 'blockquote' },
      ],
      lists: [
        { title: 'Aufzählung', value: 'bullet' },
        { title: 'Nummerierte Liste', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Fett', value: 'strong' },
          { title: 'Kursiv', value: 'em' },
          { title: 'Unterstrichen', value: 'underline' },
          { title: 'Durchgestrichen', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
              },
              {
                name: 'openInNewTab',
                title: 'In neuem Tab öffnen',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Interner Link',
            fields: [
              {
                name: 'reference',
                title: 'Verweis auf',
                type: 'reference',
                to: [
                  { type: 'page' },
                  { type: 'room' },
                  { type: 'offer' },
                  { type: 'activity' },
                ],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'richImage' }),
  ],
})

/**
 * Wrapper für „lokalisiertem Portable Text" — pro Sprache ein eigenes Array.
 * Wird im Studio als zwei Tabs (DE/EN) angezeigt.
 */
export const localizedPortableText = defineType({
  name: 'localizedPortableText',
  title: 'Mehrsprachiger Inhalts-Block',
  type: 'object',
  fields: [
    {
      name: 'de',
      title: 'Deutsch',
      type: 'portableText',
    },
    {
      name: 'en',
      title: 'English',
      type: 'portableText',
    },
  ],
  options: {
    collapsible: false,
  },
})
