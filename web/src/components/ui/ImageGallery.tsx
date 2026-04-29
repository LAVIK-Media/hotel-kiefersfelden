import Image from 'next/image'
import type { ImageRef } from '~/lib/types'
import { cn } from '~/lib/cn'

type Props = {
  images: ImageRef[]
  /**
   * Editorial-Magazin-Layout: zweispaltig, asymmetrisch, ohne Lightbox.
   * Wir vermeiden bewusst Modal-Klickerei – die Bilder sind das Statement,
   * nicht das Klick-Spiel.
   */
  variant?: 'editorial' | 'grid'
}

export function ImageGallery({ images, variant = 'editorial' }: Props) {
  if (images.length === 0) return null

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {images.map((img, i) => (
          <div key={i} className="overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width ?? 1200}
              height={img.height ?? 900}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        ))}
      </div>
    )
  }

  // Editorial: 2-Spalt, asymmetrisch
  return (
    <div className="grid gap-4 md:grid-cols-12 md:gap-8">
      {images.map((img, i) => {
        // Wechselnde Größen: 7+5 / 5+7 / 6+6 / etc.
        const span =
          i % 4 === 0 ? 'md:col-span-7'
          : i % 4 === 1 ? 'md:col-span-5'
          : i % 4 === 2 ? 'md:col-span-5'
          : 'md:col-span-7'
        const aspect = i % 2 === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'
        return (
          <figure key={i} className={cn(span)}>
            <div className="overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width ?? 1600}
                height={img.height ?? 1200}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={cn('w-full object-cover', aspect)}
              />
            </div>
            {img.alt && (
              <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                {img.alt}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}
