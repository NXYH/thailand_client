/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import { ImagePlus, X } from "lucide-react"
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
import { newId, shrinkImage } from "@/lib/image"
import { saveSite, site } from "@/lib/store"
import type { Tour } from "@/lib/tours"

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)

/** tour: undefined = closed, null = new tour */
export function TourForm({
  tour,
  onClose,
}: {
  tour: Tour | null | undefined
  onClose: () => void
}) {
  return (
    <Sheet
      open={tour !== undefined}
      onOpenChange={(open) => !open && onClose()}
    >
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        {tour !== undefined && (
          <Fields key={tour?.id ?? "new"} tour={tour} onClose={onClose} />
        )}
      </SheetContent>
    </Sheet>
  )
}

function Fields({ tour, onClose }: { tour: Tour | null; onClose: () => void }) {
  const [images, setImages] = useState(tour?.images ?? [])
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const places = [...new Set(site.get().tours.map((t) => t.location))]

  function addUrl() {
    if (!URL.canParse(imageUrl) || !imageUrl.startsWith("http"))
      return toast.error("Paste a full link starting with https://")
    setImages([...images, imageUrl])
    setImageUrl("")
    setError("")
  }

  async function addFiles(files: FileList | null) {
    try {
      const added = await Promise.all([...(files ?? [])].map(shrinkImage))
      setImages((now) => [...now, ...added])
      setError("")
    } catch {
      toast.error("That photo could not be read. Try a JPG or PNG.")
    }
  }

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = (k: string) => String(f.get(k)).trim()
    const price = Number(f.get("price"))
    const discountPrice = text("discountPrice")
      ? Number(f.get("discountPrice"))
      : null

    if (images.length === 0) return setError("Add at least one photo.")
    if (discountPrice !== null && discountPrice >= price)
      return setError("Discounted price must be lower than the price.")

    const next: Tour = {
      id: tour?.id ?? newId(),
      title: text("title"),
      location: text("location"),
      description: text("description"),
      timing: text("timing"),
      inclusions: lines(text("inclusions")),
      exclusions: lines(text("exclusions")),
      price,
      discountPrice,
      images,
    }
    const data = site.get()
    const tours = tour
      ? data.tours.map((t) => (t.id === tour.id ? next : t))
      : [next, ...data.tours]
    if (saveSite({ ...data, tours })) {
      toast.success(tour ? "Tour saved" : "Tour added")
      onClose()
    }
  }

  return (
    <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
      <SheetHeader className="border-b pr-12">
        <SheetTitle className="text-2xl font-medium">
          {tour ? "Edit tour" : "Add tour"}
        </SheetTitle>
        <SheetDescription className="text-base">
          Shown on the website as soon as you save.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Field label="Title" name="title" defaultValue={tour?.title} required />

        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-base font-medium">
            Place
          </Label>
          <Input
            id="location"
            name="location"
            list="places"
            required
            defaultValue={tour?.location}
          />
          <datalist id="places">
            {places.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-base font-medium">Photos</legend>
          <p className="text-muted-foreground">The first photo is the cover.</p>
          {images.length > 0 && (
            <ul className="grid grid-cols-3 gap-2">
              {images.map((src, i) => (
                <li
                  key={src + i}
                  className="relative animate-in duration-300 zoom-in-95 fade-in"
                >
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    className="absolute top-1 right-1"
                    aria-label={`Remove photo ${i + 1}`}
                    onClick={() => setImages(images.filter((_, n) => n !== i))}
                  >
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            render={<label />}
            nativeButton={false}
          >
            <ImagePlus />
            Upload photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ""
              }}
            />
          </Button>
          <div className="flex gap-2">
            <Input
              aria-label="Photo link"
              inputMode="url"
              placeholder="Or paste a photo link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addUrl()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={addUrl}
              disabled={!imageUrl}
            >
              Add link
            </Button>
          </div>
        </fieldset>

        <Field
          label="Description"
          name="description"
          defaultValue={tour?.description}
          required
          area
        />
        <Field
          label="Timing"
          name="timing"
          placeholder="7:30 AM to 5:00 PM"
          defaultValue={tour?.timing}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Price (₹)"
            name="price"
            type="number"
            min={1}
            defaultValue={tour?.price}
            required
          />
          <Field
            label="Discounted price (₹)"
            name="discountPrice"
            type="number"
            min={1}
            defaultValue={tour?.discountPrice ?? undefined}
          />
        </div>

        <Field
          label="Inclusions, one per line"
          name="inclusions"
          defaultValue={tour?.inclusions.join("\n")}
          area
        />
        <Field
          label="Exclusions, one per line"
          name="exclusions"
          defaultValue={tour?.exclusions.join("\n")}
          area
        />
      </div>

      <SheetFooter className="border-t">
        {error && (
          <p
            role="alert"
            className="animate-in font-medium text-destructive fade-in"
          >
            {error}
          </p>
        )}
        <Button type="submit" size="lg">
          {tour ? "Save tour" : "Add tour"}
        </Button>
      </SheetFooter>
    </form>
  )
}

function Field({
  label,
  name,
  area,
  ...props
}: {
  label: string
  name: string
  area?: boolean
} & React.ComponentProps<"input">) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-base font-medium">
        {label}
      </Label>
      {area ? (
        <Textarea
          id={name}
          name={name}
          rows={4}
          required={props.required}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
        />
      ) : (
        <Input id={name} name={name} {...props} />
      )}
    </div>
  )
}
