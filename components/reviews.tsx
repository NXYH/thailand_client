/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import { Star } from "lucide-react"

import type { Review } from "@/lib/company"
import { site } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Stars({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <span
      className={cn("inline-flex gap-0.5", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "size-5",
            n <= Math.round(value) ? "fill-sun text-sun" : "text-border"
          )}
        />
      ))}
    </span>
  )
}

const initials = (name: string) =>
  name
    .replace(/^the\s+/i, "")
    .split(/\s+/)
    .filter((w) => w.toLowerCase() !== "and")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")

export function ReviewCard({
  review,
  actions,
}: {
  review: Review
  actions?: React.ReactNode
}) {
  const { tours } = site.use()
  const photo =
    review.photo ?? tours.find((t) => t.title === review.tour)?.images[0]
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {photo && (
        <div className="overflow-hidden">
          <img
            src={photo}
            alt=""
            loading="lazy"
            className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted font-medium text-primary">
            {initials(review.name)}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-medium">{review.name}</p>
            <p className="text-muted-foreground">{review.city}</p>
          </div>
          {actions}
        </div>
        <Stars value={review.rating ?? 5} className="mt-4" />
        <blockquote className="mt-2 flex-1 text-lg leading-snug">
          “{review.quote}”
        </blockquote>
        <p className="mt-4 border-t pt-3 leading-tight text-muted-foreground">
          {review.tour}
        </p>
      </div>
    </article>
  )
}

/** Platform ratings. Compact is the one-line strip on Home; the default is cards. */
export function Ratings({
  compact,
  onDark,
}: {
  compact?: boolean
  onDark?: boolean
}) {
  const { listings } = site.use()
  if (listings.length === 0) return null
  const sample = listings.some((l) => l.sample)

  return (
    <div>
      <ul
        className={cn(
          compact
            ? "flex flex-wrap items-center gap-x-8 gap-y-3"
            : "grid grid-cols-2 gap-3 text-left md:grid-cols-4"
        )}
      >
        {listings.map((l) => {
          const body = (
            <>
              <span className="block leading-tight font-medium">{l.name}</span>
              {l.rating !== null && (
                <span className="mt-1 flex items-center gap-1.5">
                  <Stars value={l.rating} className="[&_svg]:size-4" />
                  <span className="font-medium">{l.rating.toFixed(1)}</span>
                </span>
              )}
            </>
          )
          return (
            <li
              key={l.name}
              className={cn(
                !compact &&
                  "rounded-lg bg-card p-3 text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              )}
            >
              {l.url ? (
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:underline"
                >
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          )
        })}
      </ul>
      {sample && (
        <p
          className={cn(
            "mt-2 text-sm",
            onDark ? "text-white/85" : "text-muted-foreground"
          )}
        >
          Sample ratings
        </p>
      )}
    </div>
  )
}
