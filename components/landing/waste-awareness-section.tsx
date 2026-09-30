import Image from 'next/image'
import { Apple, BatteryWarning, Lightbulb, Package, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type BinGuide = {
  title: string
  bin: string
  icon: LucideIcon
  iconWrap: string
  badgeStyle: string
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
    iconWrap: 'bg-emerald-50 text-emerald-600',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    image: '/images/awareness/wet-waste.jpg',
    imageAlt: 'Fresh fruits and vegetables at a market stall',
    items: [
      'Kitchen scraps & peels',
      'Leftover food',
      'Tea leaves & coffee grounds',
      'Flowers & garden trimmings',
      'Other compostables',
    ],
  },
  {
    title: 'Dry Waste',
    bin: 'Blue Bin',
    icon: Package,
    iconWrap: 'bg-blue-50 text-blue-600',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
    image: '/images/awareness/dry-waste.jpg',
    imageAlt: 'Compressed bales of plastic bottles ready for recycling',
    items: [
      'Plastic bottles & containers',
      'Paper & cardboard',
      'Clean metal cans & foil',
      'Glass jars',
      'Tetra packs (rinsed)',
    ],
  },
  {
    title: 'Hazardous / E-Waste',
    bin: 'Red Bin',
    icon: BatteryWarning,
    iconWrap: 'bg-red-50 text-red-600',
    badgeStyle: 'bg-red-50 text-red-700 border-red-200/80',
    dot: 'bg-red-500',
    image: '/images/awareness/e-waste.jpg',
    imageAlt: 'Pile of discarded electronics, cables and appliances',
    items: [
      'Batteries & power banks',
      'Phones, chargers & electronics',
      'CFL bulbs & tubelights',
      'Paints & chemicals',
      'Medical waste & syringes',
    ],
  },
]

export function WasteAwarenessSection() {
  return (
    <section id="awareness" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16">
      <div className="text-center">
        <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
          Civic Segregation Guide
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-3">
          Sort at Source, Reduce at Scale
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
          Proper segregation prevents landfill contamination. Learn what belongs in each stream before requesting disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {GUIDES.map(({ title, bin, icon: Icon, iconWrap, badgeStyle, dot, image, imageAlt, items }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', iconWrap)}>
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
              </div>
              <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border', badgeStyle)}>
                <span className={cn('size-1.5 rounded-full', dot)} aria-hidden="true" />
                {bin}
              </span>
            </div>

            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 border-b border-dashed border-slate-200 pb-2 text-slate-600 last:border-0 last:pb-0"
                >
                  <span className={cn('size-1.5 shrink-0 rounded-full', dot)} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto mt-6 rounded-xl bg-emerald-700 text-white p-4 flex items-center gap-4 text-xs sm:text-sm">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Lightbulb className="size-4 shrink-0 text-white" aria-hidden="true" />
        </span>
        <p className="leading-relaxed">
          <strong className="font-semibold">Did you know?</strong> Proper segregation reduces landfill emissions by
          40%. Small habits at home add up to cleaner streets, beaches and waterways.
        </p>
      </div>
    </section>
  )
}
