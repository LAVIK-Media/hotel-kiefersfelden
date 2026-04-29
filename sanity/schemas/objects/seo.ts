import { defineField, defineType } from 'sanity'
import { SearchIcon } from '@sanity/icons'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'SEO-Titel',
      description: 'Erscheint im Browser-Tab und in Google. 50–60 Zeichen empfohlen.',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          for (const entry of value as Array<{ value?: string }>) {
            if (entry.value && entry.value.length > 70) {
              return 'SEO-Titel sollte unter 70 Zeichen bleiben.'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'Meta-Beschreibung',
      description: 'Erscheint in Google-Suchergebnissen. 140–160 Zeichen.',
      type: 'internationalizedArrayText',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          for (const entry of value as Array<{ value?: string }>) {
            if (entry.value && entry.value.length > 180) {
              return 'Meta-Beschreibung sollte unter 180 Zeichen bleiben.'
            }
          }
          return true
        }),
    }),
    defineField({
      name: 'ogImage',
      title: 'Vorschaubild für Social Media',
      description: 'Wird beim Teilen auf Facebook/WhatsApp/etc. angezeigt. Mindestens 1200×630 px.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Vor Google verstecken',
      description: 'Wenn aktiviert, erscheint diese Seite nicht in Google-Suchergebnissen.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
