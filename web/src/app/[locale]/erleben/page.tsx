import { setRequestLocale } from 'next-intl/server'
import { redirect } from '~/i18n/navigation'
import type { Locale } from '~/i18n/routing'

export default async function ErlebenPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  // Erleben-Sammelseite leitet aktuell auf /sommer als Default
  // (Phase 3.5: eigene Sammelseite mit Saison-Tabs).
  redirect({ href: '/sommer', locale })
}
