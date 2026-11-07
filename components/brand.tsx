"use client"

import { rupees, salePrice } from "@/lib/booking"
import { site } from "@/lib/store"
import type { Tour } from "@/lib/tours"
import { cn } from "@/lib/utils"

export function Wordmark({ className }: { className?: string }) {
  const { company } = site.use()
  return (
    <span className={cn("text-xl font-medium tracking-tight", className)}>
      {company.name}
    </span>
  )
}

export function Price({ tour }: { tour: Tour }) {
  return (
    <p className="leading-tight">
      <span className="text-xl font-medium">{rupees(salePrice(tour))}</span>
      {tour.discountPrice !== null && (
        <s className="ml-1.5 text-muted-foreground">{rupees(tour.price)}</s>
      )}
      <span className="block text-sm text-muted-foreground">per person</span>
    </p>
  )
}
