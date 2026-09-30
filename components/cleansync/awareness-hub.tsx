import Image from 'next/image'
import { Apple, BatteryWarning, Lightbulb, Package, Recycle, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type BinGuide = {
  title: string
  bin: string
  icon: LucideIcon
  accent: string
  iconWrap: string
  dot: string
  image: string
  imageAlt: string
  items: string[]
}

const GUIDES: BinGuide[] = [
  {
    title: 'Wet Waste',
    bin: 'Green Bin',
    icon: Apple,
    accent: 'border-t-emerald-500',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
    image: '/images/awareness/wet-waste.jpg',
    imageAlt: 'Fresh fruits and vegetables at a market stall',
    items: ['Kitchen scraps & peels', 'Leftover food', 'Tea leaves & coffee grounds', 'Flowers & garden trimmings', 'Other compostables'],
  },
  {
    title: 'Dry Waste',
    bin: 'Blue Bin',
    icon: Package,
    accent: 'border-t-blue-500',
    iconWrap: 'bg-blue-50 text-blue-600',
    dot: 'bg-blue-500',
    image: '/images/awareness/dry-waste.jpg',
    imageAlt: 'Compressed bales of plastic bottles ready for recycling',
    items: ['Plastic bottles & containers', 'Paper & cardboard', 'Clean metal cans & foil', 'Glass jars', 'Tetra packs (rinsed)'],
  },
  {
    title: 'Hazardous / E-Waste',
    bin: 'Red Bin',
    icon: BatteryWarning,
    accent: 'border-t-red-500',
    iconWrap: 'bg-red-50 text-red-600',
    dot: 'bg-red-500',
    image: '/images/awareness/e-waste.jpg',
    imageAlt: 'Pile of discarded electronics, cables and appliances',
    items: ['Batteries & power banks', 'Phones, chargers & electronics', 'CFL bulbs & tubelights', 'Paints & chemicals', 'Medical waste & syringes'],
  },
]

export function AwarenessHub() {
  return (
    <section aria-labelledby="awareness-heading" className="flex flex-col gap-4">
      <div className="relative isolate overflow-hidden rounded-2xl">
        <Image
          src="/images/awareness/banner-bins.jpg"
          alt="Yellow, blue, red and green waste bins lined up against a wall"
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/10" aria-hidden="true" />
        <div className="flex min-h-48 max-w-md flex-col justify-end gap-2 p-6 text-background sm:min-h-56">
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-background/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Recycle className="size-3.5" aria-hidden="true" />
            Sort at source
          </span>
          <h2 id="awareness-heading" className="text-2xl font-semibold text-balance">
            Waste Awareness Hub
          </h2>
          <p className="text-sm text-background/85 text-pretty">
            Every bin has a purpose. Learn what goes where and help keep your neighbourhood clean.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {GUIDES.map(({ title, bin, icon: Icon, accent, iconWrap, dot, image, imageAlt, items }) => (
          <Card key={title} className={cn('overflow-hidden rounded-2xl border-t-4 pt-0', accent)}>
            <div className="relative aspect-[16/10] w-full">
              <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
            <CardHeader className="flex flex-row items-center gap-3">
              <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', iconWrap)}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <CardTitle className="text-base">{title}</CardTitle>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className={cn('size-2 rounded-full', dot)} aria-hidden="true" />
                  {bin}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 border-b border-dashed pb-2 last:border-0 last:pb-0">
                    <span className={cn('size-1.5 shrink-0 rounded-full', dot)} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <aside className="flex flex-col overflow-hidden rounded-2xl bg-primary text-primary-foreground sm:flex-row">
        <div className="relative aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:w-2/5">
          <Image
            src="/images/awareness/cleanup-drive.jpg"
            alt="Volunteers collecting plastic litter from a beach"
            fill
            sizes="(min-width: 640px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-start gap-4 p-5 sm:items-center sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
            <Lightbulb className="size-5" aria-hidden="true" />
          </span>
          <p className="text-sm text-pretty sm:text-base">
            <strong className="font-semibold">Did you know?</strong> Proper segregation reduces landfill emissions by
            40%. Small habits at home add up to cleaner streets, beaches and waterways.
          </p>
        </div>
      </aside>
    </section>
  )
}
