/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import { Check, Clock, MapPin, Plus, X } from "lucide-react"

import { Price } from "@/components/brand"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { toggleInCart } from "@/lib/store"
import type { Tour } from "@/lib/tours"

export function TourDetails({
  tour: t,
  open,
  added,
  onClose,
}: {
  tour: Tour | null
  open: boolean
  added: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      {t && (
        <DialogContent className="flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none sm:max-w-xl">
          <div className="overflow-y-auto">
            <Carousel opts={{ loop: true }}>
              <CarouselContent className="ml-0">
                {t.images.map((src, i) => (
                  <CarouselItem key={src} className="pl-0">
                    <img
                      src={src}
                      alt={`${t.title}, photo ${i + 1}`}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {t.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>

            <div className="animate-in space-y-4 p-5 duration-500 fade-in slide-in-from-bottom-2">
              <div>
                <DialogTitle className="text-2xl leading-tight font-medium sm:text-3xl">
                  {t.title}
                </DialogTitle>
                <p className="mt-1 flex flex-wrap gap-x-3 text-base text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-4" />
                    {t.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-4" />
                    {t.timing}
                  </span>
                </p>
              </div>
              <DialogDescription className="text-base leading-relaxed text-foreground">
                {t.description}
              </DialogDescription>
              <div className="grid gap-4 sm:grid-cols-2">
                <List
                  title="What's included"
                  items={t.inclusions}
                  icon={<Check className="size-4 text-primary" />}
                />
                <List
                  title="Not included"
                  items={t.exclusions}
                  icon={<X className="size-4 text-destructive" />}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t px-5 py-3">
            <Price tour={t} />
            <Button
              variant={added ? "outline" : "default"}
              onClick={() => {
                toggleInCart(t.id)
                if (!added) onClose()
              }}
            >
              {added ? <Check /> : <Plus />}
              {added ? "Added" : "Add to trip"}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

function List({
  title,
  items,
  icon,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
}) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="text-base font-medium">{title}</h3>
      <ul className="mt-1 space-y-1 text-base leading-snug">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 shrink-0">{icon}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
