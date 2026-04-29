import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'
import { ALLERGEN_OPTIONS, ADDITIVE_OPTIONS } from '../../lib/allergens'

/**
 * Wiederverwendbares Standard-Gericht.
 *
 * Verwendung: Klassiker, die in mehreren Karten erscheinen
 * (z.B. „Hausgemachter Kaiserschmarrn"). Eine Preisänderung hier wirkt
 * sofort in allen Karten, die dieses Gericht referenzieren.
 *
 * Für Einmal-Spezialitäten (Tagesempfehlung, Wildwoche) eher
 * `inlineMenuItem` direkt in der Karte verwenden.
 */
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Standard-Gericht',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name des Gerichts',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )?.value
          if (!de || de.trim().length === 0) return 'Name (DE) ist Pflicht.'
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'price',
      title: 'Preis (EUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(500).precision(2),
    }),
    defineField({
      name: 'category',
      title: 'Standard-Kategorie',
      description: 'Hilft beim Filtern. Karten-Sektionen werden in `menu.sections` einzeln gepflegt.',
      type: 'string',
      options: {
        list: [
          { title: 'Vorspeise', value: 'starter' },
          { title: 'Suppe', value: 'soup' },
          { title: 'Hauptgang Fleisch', value: 'main_meat' },
          { title: 'Hauptgang Fisch', value: 'main_fish' },
          { title: 'Hauptgang Vegetarisch', value: 'main_vegetarian' },
          { title: 'Brotzeit', value: 'snack' },
          { title: 'Beilage', value: 'side' },
          { title: 'Dessert', value: 'dessert' },
          { title: 'Kindergericht', value: 'kids' },
          { title: 'Sonstiges', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'tags',
      title: 'Eigenschaften (Tags)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Regional', value: 'regional' },
          { title: 'Wild', value: 'wild' },
          { title: 'Aus eigener Metzgerei', value: 'eigene-metzgerei' },
          { title: 'Saisonal', value: 'saisonal' },
          { title: 'Klassiker', value: 'klassiker' },
          { title: 'Glutenfrei möglich', value: 'glutenfrei-moeglich' },
          { title: 'Laktosefrei möglich', value: 'laktosefrei-moeglich' },
        ],
        layout: 'tags',
      },
    }),
    defineField({
      name: 'allergens',
      title: 'Allergene (LMIV)',
      description: 'Mehrfachauswahl. Pflichtkennzeichnung gemäß LMIV (EU 1169/2011).',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ALLERGEN_OPTIONS },
    }),
    defineField({
      name: 'additives',
      title: 'Zusatzstoffe',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ADDITIVE_OPTIONS },
    }),
    defineField({
      name: 'isVegetarian',
      title: 'Vegetarisch',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isVegan',
      title: 'Vegan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isHouseRecommendation',
      title: 'Empfehlung des Hauses',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Bild (optional)',
      type: 'richImage',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      price: 'price',
      cat: 'category',
      empf: 'isHouseRecommendation',
      veg: 'isVegetarian',
      vegan: 'isVegan',
      media: 'image',
    },
    prepare({ name, price, cat, empf, veg, vegan, media }) {
      const de = (name as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      const flags = [empf ? '★' : null, vegan ? 'vegan' : veg ? 'veg.' : null]
        .filter(Boolean)
        .join(' · ')
      return {
        title: de || '(Ohne Name)',
        subtitle: `${cat ?? '—'}  ·  ${price ? `${price.toFixed(2)} €` : '— €'}${flags ? `  ·  ${flags}` : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Kategorie + Preis',
      name: 'categoryPrice',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'price', direction: 'asc' },
      ],
    },
  ],
})
