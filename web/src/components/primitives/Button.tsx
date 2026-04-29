import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '~/lib/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'plain'
type Size = 'sm' | 'md' | 'lg'

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors ' +
  'duration-[var(--duration-fast)] ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-loden)]'

const variantClasses: Record<Variant, string> = {
  primary:
    'text-[var(--color-paper)] ' +
    'bg-[linear-gradient(135deg,var(--color-loden)_0%,var(--color-alpine)_55%,var(--color-loden-deep)_100%)] ' +
    'shadow-[var(--shadow-soft)] ' +
    'hover:shadow-[var(--shadow-lift)] ' +
    'hover:brightness-[1.02] active:brightness-[0.98] ' +
    'transition-[box-shadow,filter,transform] duration-[var(--duration-base)] ease-[var(--ease-soft)] ' +
    'hover:-translate-y-[1px]',
  outline:
    'border border-[color-mix(in_srgb,var(--color-ink)_40%,transparent)] ' +
    'bg-[rgba(255,255,255,0.55)] ' +
    'text-[var(--color-ink)] ' +
    'shadow-[0_1px_2px_rgba(31,29,26,0.05)] ' +
    'hover:bg-[rgba(255,255,255,0.8)] hover:shadow-[var(--shadow-soft)]',
  ghost:
    'text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]',
  plain:
    'text-[var(--color-loden)] underline-offset-4 hover:underline rounded-none',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-[0.95rem] px-5 py-2.5',
  lg: 'text-base px-7 py-3',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never
}
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}
type Props = ButtonProps | AnchorProps

export function Button(props: Props) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props as Props & {
    variant?: Variant
    size?: Size
    className?: string
    children: ReactNode
  }
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if ('href' in rest && rest.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
