import { defineRouting } from 'next-intl/routing'

/**
 * Sprach-Routing-Konfiguration.
 *
 * – DE ist Default, sichtbar unter `/de/...` und auch unter `/...` (root).
 * – EN ist `/en/...`.
 * – `localePrefix: 'as-needed'` erzeugt SEO-saubere URLs:
 *     /            → DE-Root
 *     /zimmer      → DE
 *     /en          → EN-Root
 *     /en/zimmer   → EN
 */
export const routing = defineRouting({
  locales: ['de', 'en'] as const,
  defaultLocale: 'de',
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
