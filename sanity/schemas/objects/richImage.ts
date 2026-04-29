import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

/**
 * Bild mit Hotspot/Crop und mehrsprachigem Alt-Text.
 * Alt-Text DE ist Pflicht (Barrierefreiheit), EN optional.
 */
export const richImage = defineType({
  name: 'richImage',
  title: 'Bild',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt-Text (Bildbeschreibung)',
      description:
        'Was zeigt das Bild? Wichtig für Barrierefreiheit (Screenreader) und Google. Beispiel: „Doppelzimmer mit Blick auf den Wendelstein".',
      type: 'internationalizedArrayString',
      validation: (Rule) =>
        Rule.custom((value) => {
          const de = (value as Array<{ _key: string; value?: string }> | undefined)?.find(
            (v) => v._key === 'de',
          )
          if (!de?.value || de.value.trim().length === 0) {
            return 'Deutscher Alt-Text ist Pflicht.'
          }
          return true
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Bildunterschrift (optional)',
      type: 'internationalizedArrayString',
    }),
  ],
})
