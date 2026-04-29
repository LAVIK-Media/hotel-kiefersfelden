import { cn } from '~/lib/cn'
import type { ReactNode } from 'react'

type Props = {
  size?: 'prose' | 'narrow' | 'wide'
  className?: string
  as?: keyof JSX.IntrinsicElements
  children: ReactNode
}

export function Container({ size = 'narrow', className, as = 'div', children }: Props) {
  const Tag = as as 'div'
  return (
    <Tag className={cn(`container-${size}`, className)}>
      {children}
    </Tag>
  )
}
