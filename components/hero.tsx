/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import { Check, Plus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Price } from "@/components/brand"
import { TourDetails } from "@/components/tour-details"
import { Button } from "@/components/ui/button"
import { cart, site, toggleInCart } from "@/lib/store"
import { cn } from "@/lib/utils"

const scenes: Record<string, { photo: string; line: string }> = {
  Phuket: {
    photo: "/images/hero-phuket.jpg",
    line: "Turquoise bays, long-tail boats and hidden lagoons.",
  },
  Krabi: {
    photo: "/images/hero-krabi.jpg",
    line: "Limestone cliffs and islands you can walk between.",
  },
  Bangkok: {
    photo: "/images/hero-bangkok.jpg",
    line: "Golden temples, river ferries and floating markets.",
  },
  "Chiang Mai": {
    photo: "/images/hero-chiang-mai.jpg",
    line: "Mountain temples and rescued elephants.",
  },
  Pattaya: {
    photo: "/images/hero-pattaya.jpg",
    line: "Island beaches and a temple carved from wood.",
  },
}

export function Hero() {
  const { tours } = site.use()
  const ids = cart.use()
  const [picked, setPicked] = useState(0)
  const [paused, setPaused] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // One scene per place on the website, so tours added in admin appear here too.
  const slides = useMemo(
    () =>
      [...new Set(tours.map((t) => t.location))].map((place) => {
        const tour = tours.find((t) => t.location === place)!
        return {
          place,
          tour,
          photo: scenes[place]?.photo ?? tour.images[0],
          line: scenes[place]?.line ?? `Day tours in ${place}.`,
        }
      }),
    [tours]
  )
  const index = slides.length ? picked % slides.length : 0
  const slide = slides[index]
  const added = !!slide && ids.includes(slide.tour.id)

  return (
    <section
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden bg-foreground text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.place}
          src={s.photo}
          alt={i === index ? `${s.place}, Thailand` : ""}
          fetchPriority={i === 0 ? "high" : "low"}
          className={cn(
            "absolute inset-0 -z-20 size-full object-cover transition-opacity duration-1000",
            i === index ? "hero-drift opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10263a]/90 via-[#10263a]/25 to-[#10263a]/10" />

      <div className="mx-auto grid w-full max-w-6xl items-end gap-6 px-4 pt-16 pb-5 sm:px-6 md:grid-cols-[1fr_21rem] md:gap-10">
        <div>
          <h1 className="text-lg font-medium sm:text-xl">
            Thailand day tours for Indian travellers
          </h1>
          {slide && (
            <div
              key={slide.place}
              className="animate-in duration-700 fade-in slide-in-from-bottom-3"
            >
              <p className="text-[clamp(4rem,18vw,9.5rem)] leading-[0.95] font-normal tracking-tight">
                {slide.place}
              </p>
              <p className="mt-3 max-w-[34ch] text-xl leading-snug sm:text-2xl">
                {slide.line}
              </p>
            </div>
          )}
          <Button
            size="lg"
            className="mt-5"
            render={<Link href="/tours" />}
            nativeButton={false}
          >
            See all day tours
          </Button>
        </div>

        {slide && (
          <div
            key={slide.tour.id}
            className="animate-in rounded-md bg-card p-4 text-card-foreground shadow-lg duration-700 fade-in slide-in-from-right-3"
          >
            <button
              onClick={() => setDetailsOpen(true)}
              className="w-full text-left text-lg leading-tight font-medium outline-none hover:underline focus-visible:underline"
            >
              {slide.tour.title}
            </button>
            <p className="mt-0.5 text-muted-foreground">{slide.tour.timing}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <Price tour={slide.tour} />
              <Button
                variant={added ? "secondary" : "default"}
                aria-pressed={added}
                aria-label={`${added ? "Remove" : "Add"} ${slide.tour.title} ${added ? "from" : "to"} my trip`}
                onClick={() => toggleInCart(slide.tour.id)}
              >
                {added ? <Check /> : <Plus />}
                {added ? "Added" : "Add"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div
        role="group"
        aria-label="Choose a place"
        className="mx-auto flex w-full max-w-6xl gap-5 overflow-x-auto px-4 pb-4 sm:px-6"
      >
        {slides.map((s, i) => (
          <button
            key={s.place}
            aria-pressed={i === index}
            onClick={() => setPicked(i)}
            className={cn(
              "min-w-20 flex-1 shrink-0 pb-1 text-left text-base outline-none focus-visible:underline sm:text-lg",
              i === index ? "font-medium" : "text-white/75 hover:text-white"
            )}
          >
            {s.place}
            <span className="mt-1.5 block h-0.5 overflow-hidden bg-white/30">
              {i === index && (
                // The bar finishing moves to the next place. Reduced motion turns it off, so nothing auto-advances.
                <span
                  key={index}
                  className="hero-progress block h-full bg-white"
                  style={{ animationPlayState: paused ? "paused" : "running" }}
                  onAnimationEnd={() => setPicked(index + 1)}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {slide && (
        <TourDetails
          tour={slide.tour}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          added={added}
        />
      )}
    </section>
  )
}
