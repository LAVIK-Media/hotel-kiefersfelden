import Image from 'next/image'
import { useFormatter, useTranslations } from 'next-intl'
import type { Offer } from '~/lib/types'

type Props = { offer: Offer }

export function OfferCard({ offer }: Props) {
  const t = useTranslations('rooms')
  const format = useFormatter()
  const hero = offer.gallery?.[0]

  return (
    <article className="group surface-card surface-card-hover overflow-hidden">
      {hero && (
        <div className="overflow-hidden">
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width ?? 1200}
            height={hero.height ?? 800}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="px-6 pb-6 pt-5">
        <p className="eyebrow">
          {offer.season === 'summer' && 'Sommer'}
          {offer.season === 'winter' && 'Winter'}
          {offer.season === 'autumn' && 'Herbst'}
          {offer.season === 'spring' && 'Frühling'}
          {offer.season === 'allyear' && 'Ganzjährig'}
          {offer.minStay && ` · ${offer.minStay} Nächte`}
        </p>
        <h3 className="mt-2 font-serif text-2xl tracking-tight">{offer.title}</h3>
        <p className="mt-3 text-[var(--color-ink-mute)] leading-relaxed">
          {offer.shortDescription}
        </p>
        <p className="mt-5 text-sm text-[var(--color-ink-mute)]">
          {t('from')}{' '}
          <span className="font-serif text-xl text-[var(--color-ink)]">
            {format.number(offer.price, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </span>{' '}
          {offer.pricePerPerson ? '/ Person' : ''}
        </p>
      </div>
    </article>
  )
}
