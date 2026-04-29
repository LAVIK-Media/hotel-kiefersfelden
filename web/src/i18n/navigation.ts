import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Drop-in-Replacements für Next-Komponenten/Hooks, die automatisch
 * den aktuellen Locale-Prefix berücksichtigen.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
