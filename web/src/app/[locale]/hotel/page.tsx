import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { Hero } from '~/components/ui/Hero'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { ImageGallery } from '~/components/ui/ImageGallery'
import type { Locale } from '~/i18n/routing'

export default async function HotelPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const galleryImages = [
    { src: '/images/hotel/aussenansicht.jpg', alt: locale === 'en' ? 'Exterior view' : 'Außenansicht', width: 1134, height: 493 },
    { src: '/images/hotel/rezeption.jpg', alt: locale === 'en' ? 'Reception' : 'Rezeption', width: 1134, height: 493 },
    { src: '/images/region/biergarten.jpg', alt: locale === 'en' ? 'Beer garden' : 'Biergarten', width: 1134, height: 493 },
    { src: '/images/region/winter-stube.jpg', alt: locale === 'en' ? 'Hunting parlour' : 'Kaminstube', width: 1134, height: 493 },
  ]

  return (
    <>
      <Hero
        image={{ src: '/images/hero/hotel.jpg', alt: 'Hotel zur Post', width: 2253, height: 1253 }}
        eyebrow={locale === 'en' ? 'The house' : 'Das Haus'}
        headline={
          locale === 'en'
            ? 'Two centuries.\nFour generations.\nOne family.'
            : 'Zwei Jahrhunderte.\nVier Generationen.\nEine Familie.'
        }
        size="compact"
        overlay="strong"
      />

      <section className="container-narrow py-24 md:py-32">
        <SectionIntro
          headline={
            locale === 'en'
              ? 'A Royal Bavarian post station, since 1820.'
              : 'Königlich Bayerische Poststation, seit 1820.'
          }
          body={
            <p>
              {locale === 'en'
                ? 'When Andi’s great-grandfather took over the inn, the postal coach still stopped at our door. The coach is still here. The horses too — Andi keeps two of them, and on Sunday mornings he harnesses them himself.'
                : 'Als Andis Urgroßvater den Gasthof übernahm, hielt die Postkutsche noch vor der Tür. Die Kutsche steht heute noch hier. Die Pferde auch – Andi hält zwei davon, und am Sonntagvormittag spannt er sie selbst ein.'}
            </p>
          }
          className="mb-20"
        />

        <ImageGallery images={galleryImages} variant="editorial" />
      </section>

      <section className="bg-[var(--color-paper-soft)] py-24 md:py-32">
        <div className="container-narrow grid gap-12 md:grid-cols-12 md:gap-20">
          <figure className="surface-card surface-card-hover overflow-hidden md:col-span-5">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/images/hotel/wirtin.jpg"
                alt={locale === 'en' ? 'Christine Pfeiffer, the innkeeper' : 'Christine Pfeiffer, die Wirtin'}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
          <div className="md:col-span-7 md:pt-12">
            <SectionIntro
              eyebrow={locale === 'en' ? 'The hosts' : 'Die Wirtsleute'}
              small
              headline={
                locale === 'en'
                  ? 'Christine and Andi Pfeiffer'
                  : 'Christine und Andi Pfeiffer'
              }
              body={
                <p>
                  {locale === 'en'
                    ? 'Christine runs the parlour, Andi the kitchen and the horses. Together they run the house — with a head chef, a butcher, and a small team that has been with us for years.'
                    : 'Christine führt die Stube, Andi die Küche und die Pferde. Gemeinsam führen sie das Haus – mit einem Küchenchef, einem Metzger und einem kleinen Team, das seit Jahren bei uns ist.'}
                </p>
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}
