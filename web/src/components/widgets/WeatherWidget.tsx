import { getTranslations } from 'next-intl/server'
import type { Locale } from '~/i18n/routing'

type Props = {
  locale: Locale
  lat?: number
  lng?: number
}

type OpenMeteoResponse = {
  current?: {
    temperature_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  daily?: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
  }
}

const codeIconDe: Record<number, string> = {
  0: 'klar', 1: 'meist klar', 2: 'teils bewölkt', 3: 'bedeckt',
  45: 'Nebel', 48: 'Reif­nebel',
  51: 'leichter Niesel', 53: 'Niesel', 55: 'starker Niesel',
  61: 'leichter Regen', 63: 'Regen', 65: 'starker Regen',
  71: 'leichter Schnee', 73: 'Schnee', 75: 'starker Schnee',
  80: 'Schauer', 81: 'kräftige Schauer', 82: 'sehr kräftige Schauer',
  95: 'Gewitter', 96: 'Gewitter mit Hagel', 99: 'schweres Gewitter',
}
const codeIconEn: Record<number, string> = {
  0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast',
  45: 'fog', 48: 'rime fog',
  51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle',
  61: 'light rain', 63: 'rain', 65: 'heavy rain',
  71: 'light snow', 73: 'snow', 75: 'heavy snow',
  80: 'showers', 81: 'heavy showers', 82: 'violent showers',
  95: 'thunderstorm', 96: 'thunder + hail', 99: 'severe thunderstorm',
}

/**
 * Server-Component, fetched Wetter via Open-Meteo (DWD-Daten, kein API-Key).
 * Open-Meteo ist DSGVO-freundlich, keine Cookies, keine Tracking.
 */
export async function WeatherWidget({ locale, lat = 47.6155, lng = 12.1864 }: Props) {
  const t = await getTranslations({ locale, namespace: 'weather' })

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=Europe%2FBerlin&forecast_days=2`

  let data: OpenMeteoResponse | null = null
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } }) // 30 min Cache
    if (res.ok) data = (await res.json()) as OpenMeteoResponse
  } catch {
    // Silent: zeigen Fallback unten
  }

  if (!data?.current || !data?.daily) {
    return (
      <div className="border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-6">
        <p className="eyebrow">{t('title')}</p>
        <p className="mt-2 text-sm text-[var(--color-ink-mute)]">{t('loading')}</p>
      </div>
    )
  }

  const codes = locale === 'en' ? codeIconEn : codeIconDe
  const today = {
    desc: codes[data.current.weather_code] ?? '',
    temp: Math.round(data.current.temperature_2m),
    max: Math.round(data.daily.temperature_2m_max[0] ?? data.current.temperature_2m),
    min: Math.round(data.daily.temperature_2m_min[0] ?? data.current.temperature_2m),
  }
  const tomorrow = {
    desc: codes[data.daily.weather_code[1] ?? 0] ?? '',
    max: Math.round(data.daily.temperature_2m_max[1] ?? 0),
    min: Math.round(data.daily.temperature_2m_min[1] ?? 0),
  }

  return (
    <div className="border border-[var(--color-line)] bg-[var(--color-paper-soft)] p-6 md:p-8">
      <p className="eyebrow">{t('title')}</p>

      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            {t('today')}
          </p>
          <p className="mt-2 font-serif text-4xl text-[var(--color-ink)]">
            {today.temp}°
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-mute)]">
            {today.desc} · {today.min}° / {today.max}°
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            {t('tomorrow')}
          </p>
          <p className="mt-2 font-serif text-4xl text-[var(--color-ink)]">
            {tomorrow.max}°
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-mute)]">
            {tomorrow.desc} · {tomorrow.min}° / {tomorrow.max}°
          </p>
        </div>
      </div>

      <p className="mt-6 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {t('source')}
      </p>
    </div>
  )
}
