/* eslint-disable @next/next/no-img-element -- review photos are uploaded data URLs */
"use client"

import { ImagePlus, Star, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import type { Review } from "@/lib/company"
import { newId, shrinkImage } from "@/lib/image"
import { saveSite, site } from "@/lib/store"
import { cn } from "@/lib/utils"

/** review: undefined = closed, null = new review. Used by visitors on the website and in admin. */
export function ReviewForm({
  review,
  onClose,
}: {
  review: Review | null | undefined
  onClose: () => void
}) {
  return (
    <Sheet
      open={review !== undefined}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        {review !== undefined && (
          <Fields key={review?.id ?? "new"} review={review} onClose={onClose} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function Fields({
  review,
  onClose,
}: {
  review: Review | null
  onClose: () => void
}) {
  const [rating, setRating] = useState(review?.rating ?? 5)
  const [photo, setPhoto] = useState(review?.photo ?? "")
  const { tours } = site.get()

  async function upload(file?: File) {
    if (!file) return
    try {
      setPhoto(await shrinkImage(file))
    } catch {
      toast.error("That photo could not be read. Try a JPG or PNG.")
    }
  }

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = (k: string) => String(f.get(k)).trim()
    const next: Review = {
      id: review?.id ?? newId(),
      name: text("reviewName"),
      city: text("city"),
      tour: text("tour"),
      quote: text("quote"),
      rating,
      ...(photo && { photo }),
    }
    const data = site.get()
    const reviews = review
      ? data.reviews.map((r) => (r.id === review.id ? next : r))
      : [next, ...data.reviews]
    if (saveSite({ ...data, reviews })) {
      toast.success(review ? "Review saved" : "Thanks! Your review is added")
      onClose()
    }
  }

  return (
    <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
      <SheetHeader className="border-b pr-12">
        <SheetTitle className="text-2xl font-medium">
          {review ? "Edit review" : "Write a review"}
        </SheetTitle>
        <SheetDescription className="text-base">
          Shown on the website as soon as you save.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Field
          label="Name"
          name="reviewName"
          defaultValue={review?.name}
          autoComplete="name"
        />
        <Field label="City" name="city" defaultValue={review?.city} />
        <Field
          label="Tour"
          name="tour"
          list="tour-titles"
          defaultValue={review?.tour}
        />
        <datalist id="tour-titles">
          {tours.map((t) => (
            <option key={t.id} value={t.title} />
          ))}
        </datalist>

        <fieldset>
          <legend className="text-base font-medium">Rating</legend>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} out of 5 stars`}
                aria-pressed={rating === n}
                onClick={() => setRating(n)}
                className="rounded p-1 transition-transform outline-none hover:scale-125 focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-95"
              >
                <Star
                  className={cn(
                    "size-7",
                    n <= rating ? "fill-sun text-sun" : "text-border"
                  )}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="quote" className="text-base font-medium">
            Review
          </Label>
          <Textarea
            id="quote"
            name="quote"
            rows={5}
            required
            defaultValue={review?.quote}
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-base font-medium">Photo (optional)</legend>
          {photo && (
            <div className="relative w-48 animate-in duration-300 zoom-in-95 fade-in">
              <img
                src={photo}
                alt="Review photo"
                className="aspect-[3/2] w-full rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                className="absolute top-1 right-1"
                aria-label="Remove photo"
                onClick={() => setPhoto("")}
              >
                <X />
              </Button>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            render={<label />}
            nativeButton={false}
          >
            <ImagePlus />
            {photo ? "Change photo" : "Upload a photo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                upload(e.target.files?.[0])
                e.target.value = ""
              }}
            />
          </Button>
        </fieldset>
      </div>

      <SheetFooter className="border-t">
        <Button type="submit" size="lg">
          {review ? "Save review" : "Add review"}
        </Button>
      </SheetFooter>
    </form>
  )
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.ComponentProps<"input">) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-base font-medium">
        {label}
      </Label>
      <Input id={name} name={name} required {...props} />
    </div>
  )
}
