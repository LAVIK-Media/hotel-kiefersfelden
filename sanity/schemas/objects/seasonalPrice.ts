import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

export const seasonalPrice = defineType({
  name: 'seasonalPrice',
  title: 'Saisonpreis',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'seasonName',
      title: 'Saisonbezeichnung',
      description: 'z.B. „Sommer 2026", „Hauptsaison", „Wintertraum".',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validFrom',
      title: 'Gültig ab',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'validUntil',
      title: 'Gültig bis',
      type: 'date',
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField('validFrom')).error(
          '„Gültig bis" muss nach „Gültig ab" liegen.',
        ),
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Preis pro Nacht (EUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(2000),
    }),
    defineField({
      name: 'minStay',
      title: 'Mindestaufenthalt (Nächte)',
      description: 'Falls bei dieser Saison ein Mindestaufenthalt gilt. Sonst leer lassen.',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(30),
    }),
    defineField({
      name: 'includes',
      title: 'Im Preis enthalten',
      description: 'Beispiel: „inkl. Frühstücksbuffet, MwSt. und Kurtaxe".',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      seasonName: 'seasonName',
      from: 'validFrom',
      to: 'validUntil',
      price: 'pricePerNight',
    },
    prepare({ seasonName, from, to, price }) {
      const de = (seasonName as Array<{ _key: string; value?: string }> | undefined)?.find(
        (n) => n._key === 'de',
      )?.value
      return {
        title: de || 'Saisonpreis',
        subtitle: `${price ? `${price} €/Nacht` : '— EUR'} · ${from ?? '?'} – ${to ?? '?'}`,
      }
    },
  },
})
