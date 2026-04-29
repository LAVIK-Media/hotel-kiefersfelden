import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const amenity = defineType({
  name: 'amenity',
  title: 'Ausstattung',
  type: 'document',
  icon: TagIcon,
  description:
    'Ausstattungs-Merkmale für Zimmer und Ferienhaus. Einmal anlegen, in beliebig vielen Zimmern wiederverwenden.',
  fields: [
    defineField({
      name: 'name',
      title: 'Bezeichnung',
      description: 'z.B. „Föhn", „WLAN kostenlos", „Fernseher mit Sat", „Balkon".',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Bezeichnung (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Bad', value: 'bath' },
          { title: 'Komfort', value: 'comfort' },
          { title: 'Technik / Medien', value: 'tech' },
          { title: 'Ausblick / Lage', value: 'view' },
          { title: 'Familie', value: 'family' },
          { title: 'Barrierefreiheit', value: 'accessibility' },
          { title: 'Sonstiges', value: 'other' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'comfort',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Symbol-Schlüssel (optional)',
      description:
        'Optionaler Schlüssel für das Frontend-Icon-Set (z.B. „wifi", „tv", „bath", „balcony"). Wenn leer, zeigt das Frontend nur den Text.',
      type: 'string',
    }),
  ],
  preview: {
    select: { name: 'name', category: 'category' },
    prepare({ name, category }) {
      const de = (name as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      return { title: de || '(Ohne Name)', subtitle: category as string }
    },
  },
  orderings: [
    {
      title: 'Kategorie',
      name: 'category',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'name[0].value', direction: 'asc' },
      ],
    },
  ],
})
