/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import { Price } from "@/components/brand"
import { rupees } from "@/lib/booking"
import type { Tour } from "@/lib/tours"

/** The same card on the website and in admin. Only the buttons in `children` differ. */
export function TourCard({
  tour,
  onOpen,
  children,
}: {
  tour: Tour
  onOpen: () => void
  children: React.ReactNode
}) {
  const saving =
    tour.discountPrice === null ? 0 : tour.price - tour.discountPrice
  return (
    <article className="flex h-full flex-col">
      <button onClick={onOpen} className="group flex-1 text-left outline-none">
        <span className="relative block overflow-hidden rounded-md shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
          <img
            src={tour.images[0]}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {saving > 0 && (
            <span className="absolute top-2 left-2 rounded bg-sun px-2 py-0.5 text-sm font-medium">
              Save {rupees(saving)}
            </span>
          )}
        </span>
        <span className="mt-3 block text-xl leading-tight font-medium group-hover:underline group-focus-visible:underline">
          {tour.title}
        </span>
        <span className="mt-1 block text-muted-foreground">
          {tour.location}, {tour.timing}
        </span>
      </button>
      <div className="mt-3 flex items-center justify-between gap-3">
        <Price tour={tour} />
        {children}
      </div>
    </article>
  )
}
