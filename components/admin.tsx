"use client"

import { Pencil, Plus, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { Wordmark } from "@/components/brand"
import { Reveal } from "@/components/reveal"
import { ReviewForm } from "@/components/review-form"
import { ReviewCard } from "@/components/reviews"
import { TourCard } from "@/components/tour-card"
import { TourForm } from "@/components/tour-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { digits } from "@/lib/booking"
import type { Company, Listing, Review } from "@/lib/company"
import { saveSite, site } from "@/lib/store"
import type { Tour } from "@/lib/tours"

const panelTitle = "text-3xl font-normal tracking-tight sm:text-4xl"
type Pending = { label: string; remove: () => void }

export function Admin() {
  const data = site.use()
  // undefined = closed, null = new item
  const [editingTour, setEditingTour] = useState<Tour | null | undefined>(
    undefined
  )
  const [editingReview, setEditingReview] = useState<Review | null | undefined>(
    undefined
  )
  const [pending, setPending] = useState<Pending | null>(null)
  const [resetting, setResetting] = useState(false)

  const average = data.reviews.length
    ? data.reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) /
      data.reviews.length
    : 0
  const glance = [
    ["Tours", data.tours.length],
    ["Places", new Set(data.tours.map((t) => t.location)).size],
    ["Reviews", data.reviews.length],
    ["Average rating", data.reviews.length ? average.toFixed(1) : "None"],
  ] as const

  return (
    <Tabs defaultValue="tours" className="gap-0">
      <title>{`Admin: ${data.company.name}`}</title>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="leading-tight">
            <Wordmark />
            <p className="text-sm text-muted-foreground">Admin panel</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/" />}
            nativeButton={false}
          >
            View website
          </Button>
        </div>
      </header>

      <section className="bg-primary text-white">
        <div className="mx-auto max-w-6xl animate-in px-4 py-8 duration-700 fade-in slide-in-from-bottom-4 sm:px-6">
          <h1 className="text-[clamp(2rem,5vw,3rem)] leading-tight font-normal tracking-tight">
            Manage your website
          </h1>
          <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {glance.map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg bg-card p-3 text-card-foreground shadow-sm"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-3xl font-normal">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="sticky top-16 z-20 border-b bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TabsList
            variant="line"
            className="h-12 w-full justify-start gap-4 sm:w-fit"
          >
            <TabsTrigger
              value="tours"
              className="flex-none px-1 text-[1.05rem]"
            >
              Tours
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex-none px-1 text-[1.05rem]"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="flex-none px-1 text-[1.05rem]"
            >
              Company
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        {!data.whatsapp && (
          <Alert className="animate-in border-0 bg-sun fade-in">
            <AlertTitle className="font-medium">
              Add your WhatsApp number
            </AlertTitle>
            <AlertDescription className="text-base text-foreground">
              Bookings need a number to go to. Add it in the Company tab.
            </AlertDescription>
          </Alert>
        )}
        <Alert className="border-0 bg-muted">
          <AlertTitle className="font-medium">Demo mode</AlertTitle>
          <AlertDescription className="text-base text-foreground">
            Changes save in this browser only, so other phones and computers
            still see the original content and no WhatsApp number. Reviews,
            ratings and company details are samples, so replace them before
            going live.
          </AlertDescription>
        </Alert>

        <TabsContent
          value="tours"
          className="animate-in space-y-6 duration-500 fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className={panelTitle}>Day tours</h2>
            <Button onClick={() => setEditingTour(null)}>
              <Plus />
              Add tour
            </Button>
          </div>
          {data.tours.length === 0 ? (
            <p className="text-lg text-muted-foreground">
              No tours on the website yet. Add your first tour to get started.
            </p>
          ) : (
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {data.tours.map((t, i) => (
                <li key={t.id}>
                  <Reveal delay={(i % 3) * 90} className="h-full">
                    <TourCard tour={t} onOpen={() => setEditingTour(t)}>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Edit ${t.title}`}
                          onClick={() => setEditingTour(t)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Delete ${t.title}`}
                          onClick={() =>
                            setPending({
                              label: t.title,
                              remove: () => {
                                if (
                                  saveSite({
                                    ...site.get(),
                                    tours: site
                                      .get()
                                      .tours.filter((x) => x.id !== t.id),
                                  })
                                )
                                  toast.success("Tour deleted")
                              },
                            })
                          }
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TourCard>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent
          value="reviews"
          className="animate-in space-y-6 duration-500 fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className={panelTitle}>Reviews</h2>
            <Button onClick={() => setEditingReview(null)}>
              <Plus />
              Add review
            </Button>
          </div>
          {data.reviews.length === 0 ? (
            <p className="text-lg text-muted-foreground">
              No reviews on the website yet.
            </p>
          ) : (
            <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {data.reviews.map((r) => (
                <li key={r.id} className="mb-5 break-inside-avoid">
                  <ReviewCard
                    review={r}
                    actions={
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit review from ${r.name}`}
                          onClick={() => setEditingReview(r)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete review from ${r.name}`}
                          onClick={() =>
                            setPending({
                              label: `the review from ${r.name}`,
                              remove: () => {
                                if (
                                  saveSite({
                                    ...site.get(),
                                    reviews: site
                                      .get()
                                      .reviews.filter((x) => x.id !== r.id),
                                  })
                                )
                                  toast.success("Review deleted")
                              },
                            })
                          }
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent
          value="company"
          className="animate-in space-y-6 duration-500 fade-in slide-in-from-bottom-2"
        >
          <h2 className={panelTitle}>Company</h2>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <WhatsAppCard key={data.whatsapp} number={data.whatsapp} />
              <RatingsCard
                key={JSON.stringify(data.listings)}
                listings={data.listings}
              />
            </div>
            <CompanyCard
              key={JSON.stringify(data.company)}
              company={data.company}
            />
          </div>
        </TabsContent>

        <Button variant="ghost" onClick={() => setResetting(true)}>
          Restore original demo data
        </Button>
      </main>

      <TourForm tour={editingTour} onClose={() => setEditingTour(undefined)} />
      <ReviewForm
        review={editingReview}
        onClose={() => setEditingReview(undefined)}
      />

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {pending?.label}?</AlertDialogTitle>
            <AlertDialogDescription>
              It disappears from the website straight away.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                pending?.remove()
                setPending(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetting} onOpenChange={setResetting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore original demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes your changes to tours, reviews, ratings and company
              details, and clears the WhatsApp number.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my changes</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                site.reset()
                setResetting(false)
                toast.success("Demo data restored")
              }}
            >
              Restore demo data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}

function WhatsAppCard({ number }: { number: string }) {
  const [value, setValue] = useState(number)
  const [error, setError] = useState(false)

  function save(e: React.FormEvent) {
    e.preventDefault()
    const n = digits(value).length
    if (n < 8 || n > 15) return setError(true)
    if (saveSite({ ...site.get(), whatsapp: digits(value) }))
      toast.success("WhatsApp number saved")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Booking WhatsApp number
        </CardTitle>
        <CardDescription className="text-base">
          Every booking goes to this number. Include the country code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={save}
          className="flex flex-col gap-2 sm:flex-row sm:items-start"
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="whatsapp" className="sr-only">
              WhatsApp number with country code
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+66 81 234 5678"
              aria-invalid={error}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
            />
            {error && (
              <p className="animate-in font-medium text-destructive fade-in slide-in-from-top-1">
                Enter 8 to 15 digits, starting with the country code.
              </p>
            )}
          </div>
          <Button type="submit" className="h-11">
            Save number
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function RatingsCard({ listings }: { listings: Listing[] }) {
  const [rows, setRows] = useState(
    listings.map((l) => ({ ...l, rating: l.rating?.toString() ?? "" }))
  )
  const [error, setError] = useState("")
  const edit = (i: number, change: Partial<(typeof rows)[number]>) =>
    setRows(rows.map((r, n) => (n === i ? { ...r, ...change } : r)))

  function save(e: React.FormEvent) {
    e.preventDefault()
    const next: Listing[] = []
    for (const row of rows) {
      const name = row.name.trim()
      if (!name) continue
      const rating = row.rating === "" ? null : Number(row.rating)
      if (rating !== null && !(rating >= 0 && rating <= 5))
        return setError(`${name}: enter a rating from 0 to 5.`)
      if (row.url && !/^https?:\/\//.test(row.url))
        return setError(`${name}: the link must start with https://`)
      const before = listings.find((l) => l.name === name)
      // The website's "Sample ratings" label stays until a number is actually changed.
      next.push({
        name,
        rating,
        url: row.url.trim(),
        sample: !!before?.sample && before.rating === rating,
      })
    }
    if (saveSite({ ...site.get(), listings: next }))
      toast.success("Ratings saved")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Ratings on other sites
        </CardTitle>
        <CardDescription className="text-base">
          Enter your real rating from each site, and link to your profile. A
          website label marks ratings as samples until you change them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className="animate-in space-y-2 border-b pb-3 duration-300 fade-in slide-in-from-left-2"
            >
              <div className="flex items-center gap-2">
                <Input
                  aria-label={`Site ${i + 1} name`}
                  placeholder="Site name"
                  value={row.name}
                  onChange={(e) => edit(i, { name: e.target.value })}
                />
                <div className="relative w-28 shrink-0">
                  <Star className="absolute top-1/2 left-3 size-4 -translate-y-1/2 fill-sun text-sun" />
                  <Input
                    aria-label={`${row.name || "Site"} rating out of 5`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="pl-9"
                    value={row.rating}
                    onChange={(e) => edit(i, { rating: e.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${row.name || "site"}`}
                  onClick={() => setRows(rows.filter((_, n) => n !== i))}
                >
                  <Trash2 />
                </Button>
              </div>
              <Input
                aria-label={`${row.name || "Site"} profile link`}
                placeholder="Profile link (optional)"
                inputMode="url"
                value={row.url}
                onChange={(e) => edit(i, { url: e.target.value })}
              />
            </div>
          ))}
          {error && (
            <p
              role="alert"
              className="animate-in font-medium text-destructive fade-in"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setRows([
                  ...rows,
                  { name: "", rating: "", url: "", sample: false },
                ])
              }
            >
              <Plus />
              Add site
            </Button>
            <Button type="submit">Save ratings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function TextField({
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

function CompanyCard({ company }: { company: Company }) {
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as unknown as Company
    if (saveSite({ ...site.get(), company: f }))
      toast.success("Company details saved")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Company details</CardTitle>
        <CardDescription className="text-base">
          Shown on the website. The name and tagline also set the browser tab
          title.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4">
          <TextField
            label="Website title"
            name="name"
            defaultValue={company.name}
          />
          <TextField
            label="Tagline"
            name="tagline"
            defaultValue={company.tagline}
          />
          <div className="space-y-1.5">
            <Label htmlFor="about" className="text-base font-medium">
              About the company
            </Label>
            <Textarea
              id="about"
              name="about"
              rows={5}
              required
              defaultValue={company.about}
            />
          </div>
          <TextField
            label="Email"
            name="email"
            type="email"
            defaultValue={company.email}
          />
          <TextField
            label="Office address"
            name="address"
            defaultValue={company.address}
          />
          <TextField
            label="Opening hours"
            name="hours"
            defaultValue={company.hours}
          />
          <Button type="submit">Save details</Button>
        </form>
      </CardContent>
    </Card>
  )
}
