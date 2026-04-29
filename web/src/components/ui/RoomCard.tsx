import Image from 'next/image'
import { Link as IntlLink } from '~/i18n/navigation'
import { useTranslations, useFormatter } from 'next-intl'
import type { Room } from '~/lib/types'

type Props = {
  room: Room
  /** Editorial-Layout — wechselt seitenweise Bild-Position links/rechts. */
  flip?: boolean
}

function minPrice(room: Room): number | undefined {
  const prices = room.seasonalPrices.map((p) => p.pricePerNight).filter(Boolean)
  return prices.length ? Math.min(...prices) : undefined
}

export function RoomCard({ room, flip }: Props) {
  const t = useTranslations('rooms')
  const tA = useTranslations('actions')
  const format = useFormatter()
  const min = minPrice(room)
  const hero = room.gallery[0]

  return (
    <article className="surface-card surface-card-hover grid items-center gap-10 overflow-hidden p-6 md:grid-cols-12 md:gap-16 md:p-10">
      {/* Bild-Spalte */}
      <div className={`md:col-span-7 ${flip ? 'md:order-2' : ''}`}>
        {hero && (
          <IntlLink href={`/zimmer/${room.slug}`} className="group block overflow-hidden rounded-[var(--radius-soft)]">
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width ?? 1600}
              height={hero.height ?? 900}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.02]"
            />
          </IntlLink>
        )}
      </div>

      {/* Text-Spalte */}
      <div className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
        <p className="eyebrow mb-3">
          {room.sizeQm && t('size', { qm: room.sizeQm })}
          {room.sizeQm && '  ·  '}
          {t('guests', { count: room.maxGuests })}
        </p>
        <h3 className="font-serif text-3xl tracking-tight md:text-4xl">{room.name}</h3>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--color-ink-mute)]">
          {room.shortDescription}
        </p>

        {min !== undefined && (
          <p className="mt-6 text-sm text-[var(--color-ink-mute)]">
            {t('from')}{' '}
            <span className="font-serif text-2xl text-[var(--color-ink)]">
              {format.number(min, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
            </span>{' '}
            {t('perNight')}
          </p>
        )}

        <div className="mt-7">
          <IntlLink
            href={`/zimmer/${room.slug}`}
            className="inline-flex items-center gap-2 border-b border-[color-mix(in_srgb,var(--color-ink)_45%,transparent)] pb-1 text-sm tracking-tight text-[var(--color-ink)] hover:border-[var(--color-loden)] hover:text-[var(--color-loden)]"
          >
            {tA('viewRoom')}
            <span aria-hidden="true">→</span>
          </IntlLink>
        </div>
      </div>
    </article>
  )
}
