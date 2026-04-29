import { useTranslations, useFormatter } from 'next-intl'
import type { Menu } from '~/lib/types'

type Props = {
  menu: Menu | null
  /** „compact" — eingebettet auf Startseite (eine Sektion + Teaser). */
  variant?: 'full' | 'compact'
}

function formatPrice(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}

export function MenuToday({ menu, variant = 'full' }: Props) {
  const t = useTranslations('menuToday')
  const format = useFormatter()

  if (!menu) {
    return (
      <p className="font-serif text-xl text-[var(--color-ink-mute)]">
        {/* Fallback-Text wird auf Aufruf-Ebene geliefert */}—
      </p>
    )
  }

  const dateLabel = menu.date
    ? format.dateTime(new Date(menu.date), { day: '2-digit', month: 'long' })
    : null

  const headline = menu.date
    ? t('title', { date: dateLabel ?? '' })
    : menu.validFrom && menu.validUntil
      ? t('weekTitle', {
          from: format.dateTime(new Date(menu.validFrom), { day: '2-digit', month: 'short' }),
          until: format.dateTime(new Date(menu.validUntil), { day: '2-digit', month: 'short' }),
        })
      : (menu.title ?? t('standardTitle'))

  // In der Compact-Variante zeigen wir nur die erste Sektion mit max. 4 Items
  const sectionsToRender = variant === 'compact'
    ? menu.sections.slice(0, 1).map((s) => ({ ...s, items: s.items.slice(0, 4) }))
    : menu.sections

  return (
    <div className="text-[var(--color-ink)]">
      <header className="border-b border-[var(--color-line)] pb-6">
        <p className="eyebrow">{menu.title}</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">{headline}</h2>
        {menu.introNote && (
          <p className="mt-4 max-w-2xl text-[var(--color-ink-mute)]">{menu.introNote}</p>
        )}
      </header>

      <div className="divide-y divide-[var(--color-line-soft)]">
        {sectionsToRender.map((section, sIdx) => (
          <section key={sIdx} className="py-10">
            <p className="eyebrow mb-6">{section.name}</p>
            <ul className="flex flex-col gap-7">
              {section.items.map((item, idx) => (
                <li key={idx} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2">
                  <div>
                    <p className="font-serif text-xl tracking-tight text-balance">
                      {item.name}
                      {item.isHouseRecommendation && (
                        <span
                          aria-label={t('houseRecommendation')}
                          title={t('houseRecommendation')}
                          className="ml-2 align-middle text-[var(--color-loden)]"
                        >
                          ★
                        </span>
                      )}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-[0.95rem] leading-relaxed text-[var(--color-ink-mute)]">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                      {item.isVegan && <span>{t('vegan')}</span>}
                      {!item.isVegan && item.isVegetarian && <span>{t('vegetarian')}</span>}
                      {item.allergens && item.allergens.length > 0 && (
                        <span aria-label={t('allergensTitle')}>
                          {t('allergensTitle')}: {item.allergens.join(' · ')}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="font-serif text-xl tabular-nums text-[var(--color-ink)]">
                    {formatPrice(item.price)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {variant === 'full' && menu.footerNote && (
        <p className="border-t border-[var(--color-line)] pt-6 text-sm text-[var(--color-ink-soft)]">
          {menu.footerNote}
        </p>
      )}

      {variant === 'full' && (
        <p className="mt-2 text-xs text-[var(--color-ink-soft)]">{t('allergensFootnote')}</p>
      )}
    </div>
  )
}
