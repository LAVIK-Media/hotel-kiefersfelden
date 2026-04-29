import { defineField, defineType } from 'sanity'
import { ALLERGEN_OPTIONS, ADDITIVE_OPTIONS } from '../../lib/allergens'

/**
 * Inline-Variante eines Menü-Eintrags.
 *
 * Wird in `menu.sections[].items` neben Referenzen auf wiederverwendbare
 * `menuItem`-Dokumente angeboten. Sinn dahinter:
 *   – Tageskarte/Schlachtfest-Aktion: oft Einmal-Gerichte → inline schneller.
 *   – Standardkarte: wiederkehrende Klassiker → Referenz auf `menuItem`,
 *     damit eine Preisänderung an einer Stelle reicht.
 */
export const inlineMenuItem = defineType({
  name: 'inlineMenuItem',
  title: 'Eintrag (einmalig)',
  type: 'object',
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
      title: 'Beschreibung (optional)',
      description: 'Kurze Beschreibung der Beilagen / Zubereitung.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'price',
      title: 'Preis (EUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(500).precision(2),
    }),
    defineField({
      name: 'allergens',
      title: 'Allergene (LMIV)',
      description: 'Mehrfachauswahl. Codes 1–14 entsprechen der Lebensmittelinformations-Verordnung.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ALLERGEN_OPTIONS },
    }),
    defineField({
      name: 'additives',
      title: 'Zusatzstoffe',
      description: 'Mehrfachauswahl, Codes a–n.',
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
      description: 'Wird im Frontend mit „Schmankerl-Stern" hervorgehoben.',
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
      veg: 'isVegetarian',
      vegan: 'isVegan',
      empf: 'isHouseRecommendation',
      media: 'image',
    },
    prepare({ name, price, veg, vegan, empf, media }) {
      const de = (name as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      const flags = [
        empf ? '★' : null,
        vegan ? 'vegan' : veg ? 'veg.' : null,
      ]
        .filter(Boolean)
        .join(' · ')
      return {
        title: de || '(Kein Name)',
        subtitle: `${price ? `${price.toFixed(2)} €` : '— €'}${flags ? `  ·  ${flags}` : ''}`,
        media,
      }
    },
  },
})
