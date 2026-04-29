import { defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ-Eintrag',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Frage',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de) return 'Frage (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'answer',
      title: 'Antwort',
      type: 'localizedPortableText',
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Anreise / Check-in', value: 'arrival' },
          { title: 'Zimmer & Ausstattung', value: 'rooms' },
          { title: 'Frühstück & Restaurant', value: 'restaurant' },
          { title: 'Tiere', value: 'pets' },
          { title: 'Familie & Kinder', value: 'family' },
          { title: 'Geschäftsreisende & Tagung', value: 'business' },
          { title: 'Parken & Anreise mit Bahn', value: 'parking' },
          { title: 'Barrierefreiheit', value: 'accessibility' },
          { title: 'Stornierung & Buchung', value: 'booking' },
          { title: 'Sonstiges', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderRank',
      title: 'Sortier-Reihenfolge innerhalb der Kategorie',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: { question: 'question', category: 'category' },
    prepare({ question, category }) {
      const de = (question as Array<{ _key: string; value?: string }> | undefined)?.find(
        (q) => q._key === 'de',
      )?.value
      return { title: de || '(Ohne Frage)', subtitle: category as string }
    },
  },
  orderings: [
    {
      title: 'Kategorie + Reihenfolge',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'orderRank', direction: 'asc' },
      ],
    },
  ],
})
