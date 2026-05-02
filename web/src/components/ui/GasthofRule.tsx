import { cn } from '~/lib/cn'

/** Stammtisch-Linie mit bayerischer Raute (Klassiker: Weiss / Königsblau). */
export function GasthofRule({ className }: { className?: string }) {
  return (
    <div className={cn('gasthof-rule-row', className)} role="presentation" aria-hidden>
      <span className="gasthof-rule-line" />
      <svg className="gasthof-rule-diamond shrink-0 text-[var(--color-copper-deep)]" viewBox="0 0 32 32" width={22} height={22}>
        <g strokeLinejoin="round">
          <polygon fill="#eef1e9" points="16,6 8,16 16,26" />
          <polygon fill="#274d92" points="16,6 24,16 16,26" />
          <polygon fill="none" stroke="currentColor" strokeWidth={1} points="16,6 24,16 16,26 8,16" />
        </g>
      </svg>
      <span className="gasthof-rule-line" />
    </div>
  )
}
