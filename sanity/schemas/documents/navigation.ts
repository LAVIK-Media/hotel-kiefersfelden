import { defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons'

/**
 * Navigations-Singletons — eines pro Position (Header / Footer-Hauptmenü /
 * Footer-Rechtliches). Die festen `_id`-Werte werden in der Desk-Structure
 * verwendet, damit die Inhaberin nur diese drei Dokumente sieht.
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Interne Bezeichnung',
      description: 'Wird nur im Studio angezeigt, nicht im Frontend.',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'position',
      title: 'Position auf der Website',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Header (Hauptmenü)', value: 'header' },
          { title: 'Footer (Hauptmenü)', value: 'footer' },
          { title: 'Footer (Rechtliches)', value: 'footerLegal' },
        ],
      },
    }),
    defineField({
      name: 'items',
      title: 'Menüpunkte',
      description: 'Reihenfolge per Drag & Drop ändern.',
      type: 'array',
      of: [{ type: 'navItem' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: (title as string) || 'Navigation',
        subtitle: `${count} Menüpunkte`,
      }
    },
  },
})
