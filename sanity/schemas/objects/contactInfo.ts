import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Kontaktdaten',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'companyName',
      title: 'Firmenname',
      type: 'string',
      initialValue: 'Hotel zur Post Kiefersfelden',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'street',
      title: 'Straße + Hausnummer',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Postleitzahl',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^\d{4,5}$/, { name: 'PLZ', invert: false }),
    }),
    defineField({
      name: 'city',
      title: 'Ort',
      type: 'string',
      initialValue: 'Kiefersfelden',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      initialValue: 'Deutschland',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      description: 'Internationales Format empfohlen, z.B. +49 8033 1234',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fax',
      title: 'Fax (optional)',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .email()
          .error('Bitte gültige E-Mail-Adresse eintragen.'),
    }),
    defineField({
      name: 'geo',
      title: 'Geo-Koordinaten',
      description: 'Für Google Maps und Schema.org. Werte aus Google Maps kopieren.',
      type: 'object',
      fields: [
        defineField({ name: 'lat', title: 'Breitengrad', type: 'number' }),
        defineField({ name: 'lng', title: 'Längengrad', type: 'number' }),
      ],
    }),
  ],
})
