import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Alle Pfade außer Next-Internas, API, statische Dateien
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
