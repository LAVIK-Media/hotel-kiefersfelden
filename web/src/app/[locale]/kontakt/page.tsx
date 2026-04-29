import { setRequestLocale, getTranslations } from 'next-intl/server'
import { SectionIntro } from '~/components/ui/SectionIntro'
import { getSiteSettings } from '~/lib/content'
import type { Locale } from '~/i18n/routing'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [settings, t, tF] = await Promise.all([
    getSiteSettings(locale),
    getTranslations({ locale, namespace: 'contact' }),
    getTranslations({ locale, namespace: 'contact.fields' }),
  ])

  return (
    <article className="container-narrow py-24 md:py-32">
      <SectionIntro
        eyebrow={t('headline')}
        headline={
          locale === 'en'
            ? 'Drop us a line, or just call.'
            : 'Schreiben Sie uns – oder rufen Sie an.'
        }
        body={<p>{t('formIntro')}</p>}
        className="mb-16"
      />

      <div className="grid gap-16 md:grid-cols-12 md:gap-20">
        {/* Kontakt-Block (links) */}
        <div className="md:col-span-5">
          <dl className="space-y-8">
            <div>
              <dt className="eyebrow mb-2">{t('phone')}</dt>
              <dd>
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="font-serif text-2xl text-[var(--color-ink)] hover:text-[var(--color-loden)]"
                >
                  {settings.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">{t('email')}</dt>
              <dd>
                <a
                  href={`mailto:${settings.contact.email}`}
                  className="font-serif text-xl text-[var(--color-ink)] hover:text-[var(--color-loden)]"
                >
                  {settings.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">{t('address')}</dt>
              <dd className="text-[var(--color-ink-mute)] not-italic leading-relaxed">
                {settings.contact.companyName}
                <br />
                {settings.contact.street}
                <br />
                {settings.contact.postalCode} {settings.contact.city}
                <br />
                {settings.contact.country}
              </dd>
            </div>
          </dl>
        </div>

        {/* Formular (rechts) */}
        <form className="md:col-span-7 flex flex-col gap-5" method="post" action="#" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label={tF('name')} name="name" type="text" required />
            <Field label={tF('email')} name="email" type="email" required />
          </div>
          <Field label={tF('phone')} name="phone" type="tel" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <Field label={tF('arrival')} name="arrival" type="date" />
            <Field label={tF('departure')} name="departure" type="date" />
            <Field label={tF('guests')} name="guests" type="number" min={1} max={10} />
          </div>
          <FieldText label={tF('message')} name="message" rows={5} required />

          <label className="mt-2 flex items-start gap-3 text-sm text-[var(--color-ink-mute)]">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-[var(--color-loden)]" />
            <span>{tF('consent')}</span>
          </label>

          <div className="mt-3">
            <button
              type="submit"
              className="rounded-full bg-[var(--color-loden)] px-7 py-3 text-[var(--color-paper)] hover:bg-[var(--color-loden-deep)]"
            >
              {tF('submit')}
            </button>
          </div>

          <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
            {locale === 'en'
              ? 'TODO Phase 3.5: server action with Cloudflare Turnstile + email forwarding to info@hotel-kiefersfelden.de.'
              : 'TODO Phase 3.5: Server-Action mit Cloudflare Turnstile + Mail-Weiterleitung an info@hotel-kiefersfelden.de.'}
          </p>
        </form>
      </div>
    </article>
  )
}

// ──────────────────────────────────────────────────────────────────
//  Form-Helpers (rein präsentational, keine Logik)
// ──────────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type,
  required,
  ...rest
}: {
  label: string
  name: string
  type: string
  required?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {label}
        {required && ' *'}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="border-b border-[var(--color-line)] bg-transparent px-0 py-2 text-base text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-soft)] focus:border-[var(--color-loden)]"
        {...rest}
      />
    </label>
  )
}

function FieldText({
  label,
  name,
  required,
  rows = 4,
}: {
  label: string
  name: string
  required?: boolean
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {label}
        {required && ' *'}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="border-b border-[var(--color-line)] bg-transparent px-0 py-2 text-base text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-loden)]"
      />
    </label>
  )
}
