/**
 * i18n-Konfiguration für das Studio.
 *
 * - DE ist Standard-Sprache (Pflichtfeld bei Validierungen).
 * - EN ist Sekundär-Sprache (für Veröffentlichung empfohlen, aber nicht hart erzwungen,
 *   damit Inhaberin Inhalte zuerst auf Deutsch anlegen und EN nachreichen kann).
 */

export const SUPPORTED_LANGUAGES = [
  { id: 'de', title: 'Deutsch' },
  { id: 'en', title: 'English' },
] as const

export type LanguageId = (typeof SUPPORTED_LANGUAGES)[number]['id']

export const DEFAULT_LANGUAGE: LanguageId = 'de'

export const LANGUAGE_IDS: LanguageId[] = SUPPORTED_LANGUAGES.map((l) => l.id)

/**
 * Liefert den DE-Wert eines internationalizedArray-Felds.
 * Nutzbar in Preview-Selectors.
 */
export function pickDe<T extends { _key: string; value?: unknown }>(
  arr: T[] | undefined,
): unknown {
  if (!arr) return undefined
  return arr.find((entry) => entry._key === 'de')?.value ?? arr[0]?.value
}
