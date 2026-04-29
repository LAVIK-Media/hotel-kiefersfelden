/**
 * Root-Layout — minimal, da next-intl die Sprache via [locale]/layout
 * setzt. Hier nur globale CSS-Imports und Schema-Defaults.
 */

import './globals.css'
import { Fraunces, Inter } from 'next/font/google'
import type { ReactNode } from 'react'

// Self-hosted via next/font/google: Dateien werden zur Build-Zeit
// geladen und mit dem Bundle ausgeliefert — kein CDN-Aufruf zur Laufzeit,
// DSGVO-konform.
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-serif-loaded',
  weight: ['300', '400', '500'],
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-sans-loaded',
  weight: ['400', '500', '600'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body
        style={{
          fontFamily: 'var(--font-sans-loaded), var(--font-sans)',
        }}
      >
        <style>{`
          h1, h2, h3, h4, .font-serif {
            font-family: var(--font-serif-loaded), var(--font-serif) !important;
          }
        `}</style>
        {children}
      </body>
    </html>
  )
}

// Default-Metadata wird in [locale]/layout.tsx gesetzt
