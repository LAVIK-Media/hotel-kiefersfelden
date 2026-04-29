/**
 * Minimaler Class-Name-Joiner. Wir vermeiden bewusst clsx/tailwind-merge,
 * weil Tailwind v4 aufeinandertreffende Utility-Konflikte selten produziert
 * und die Komponenten klein bleiben.
 */
export function cn(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ')
}
