import { defineField, defineType } from 'sanity'
import { ClockIcon } from '@sanity/icons'

const WEEKDAYS = [
  { title: 'Montag', value: 'monday' },
  { title: 'Dienstag', value: 'tuesday' },
  { title: 'Mittwoch', value: 'wednesday' },
  { title: 'Donnerstag', value: 'thursday' },
  { title: 'Freitag', value: 'friday' },
  { title: 'Samstag', value: 'saturday' },
  { title: 'Sonntag', value: 'sunday' },
] as const

const WEEKDAY_LABEL_DE: Record<string, string> = {
  monday: 'Mo',
  tuesday: 'Di',
  wednesday: 'Mi',
  thursday: 'Do',
  friday: 'Fr',
  saturday: 'Sa',
  sunday: 'So',
}

export const openingHours = defineType({
  name: 'openingHours',
  title: 'Öffnungszeit',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'day',
      title: 'Wochentag',
      type: 'string',
      options: {
        list: [...WEEKDAYS],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'closed',
      title: 'Geschlossen (Ruhetag)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'openTime',
      title: 'Öffnet um',
      description: 'Format HH:MM, z.B. 11:30',
      type: 'string',
      hidden: ({ parent }) => Boolean((parent as { closed?: boolean })?.closed),
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          if ((parent as { closed?: boolean })?.closed) return true
          if (!value) return 'Öffnungszeit angeben oder Ruhetag aktivieren.'
          if (!/^\d{2}:\d{2}$/.test(value as string)) return 'Format HH:MM erwartet.'
          return true
        }),
    }),
    defineField({
      name: 'closeTime',
      title: 'Schließt um',
      type: 'string',
      hidden: ({ parent }) => Boolean((parent as { closed?: boolean })?.closed),
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          if ((parent as { closed?: boolean })?.closed) return true
          if (!value) return 'Schließzeit angeben oder Ruhetag aktivieren.'
          if (!/^\d{2}:\d{2}$/.test(value as string)) return 'Format HH:MM erwartet.'
          return true
        }),
    }),
    defineField({
      name: 'note',
      title: 'Hinweis (optional)',
      description: 'z.B. „warme Küche bis 21:00".',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      day: 'day',
      closed: 'closed',
      open: 'openTime',
      close: 'closeTime',
    },
    prepare({ day, closed, open, close }) {
      const dayLabel = WEEKDAY_LABEL_DE[day as string] ?? day
      return {
        title: dayLabel as string,
        subtitle: closed ? 'Ruhetag' : `${open ?? '?'} – ${close ?? '?'}`,
      }
    },
  },
})
