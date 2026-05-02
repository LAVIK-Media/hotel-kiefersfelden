import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/** Experimentelles Edge-Rendering (Next 16 + OpenNext / Workers). */
export const runtime = 'experimental-edge'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
