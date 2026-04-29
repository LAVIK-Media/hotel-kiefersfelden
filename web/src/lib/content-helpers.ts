import type { LocalizedString } from './types'
import type { Locale } from '~/i18n/routing'

/** Liefert die Lokal-Variante mit DE-Fallback. */
export function resolveLocalized(value: LocalizedString, locale: Locale): string {
  if (locale === 'en' && value.en) return value.en
  return value.de
}
