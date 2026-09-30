import Link from 'next/link'
import { Recycle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-3', className)} aria-label="CleanSync home">
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Recycle className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">CleanSync</span>
    </Link>
  )
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-border bg-card text-foreground backdrop-blur-md hover:bg-secondary hover:text-secondary-foreground',
}

const buttonSizes = {
  sm: 'h-9 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'sm',
  className,
  children,
}: {
  href: string
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}>
      {children}
    </Link>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string
  title: string
  description?: string
  id?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
