import { useTranslations } from 'next-intl'
import { Link as IntlLink } from '~/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('errors')

  return (
    <article className="container-narrow flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-balance">{t('404Title')}</h1>
      <p className="mt-6 max-w-md text-[var(--color-ink-mute)]">{t('404Body')}</p>
      <IntlLink
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
      >
        {t('404Back')} →
      </IntlLink>
    </article>
  )
}
