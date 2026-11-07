/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import {
  BusFront,
  Check,
  Clock,
  Headset,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  Salad,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Hero } from "@/components/hero"
import { Reveal } from "@/components/reveal"
import { ReviewForm } from "@/components/review-form"
import { Ratings, ReviewCard, Stars } from "@/components/reviews"
import { TourCard } from "@/components/tour-card"
import { TourDetails } from "@/components/tour-details"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { digits } from "@/lib/booking"
import { faqs } from "@/lib/company"
import { cart, site, toggleInCart } from "@/lib/store"
import type { Tour } from "@/lib/tours"
import { cn } from "@/lib/utils"

const container = "mx-auto max-w-6xl px-4 sm:px-6"
const pageTitle =
  "text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.1] font-normal tracking-tight"
const sectionTitle = "text-3xl font-normal tracking-tight sm:text-4xl"
const textLink =
  "text-primary shrink-0 font-medium underline-offset-2 hover:underline"

const steps = [
  ["Pick your tours", "Add every day tour you like to your trip."],
  [
    "Add your details",
    "Your name, mobile number and how many people are coming.",
  ],
  [
    "Confirm with us",
    "We message you to confirm your dates, pickup and payment.",
  ],
]

const reasons = [
  [
    "Prices in rupees",
    "Every tour shows one clear price per person, so you can plan without converting baht.",
  ],
  [
    "Food you can eat",
    "Veg and Jain lunches can be arranged on tours that include a meal.",
  ],
  [
    "Help when you need it",
    "Ask questions, change dates and get your pickup details from a real person.",
  ],
]

const promises = [
  [IndianRupee, "Prices in rupees"],
  [Salad, "Veg and Jain meals on request"],
  [BusFront, "Hotel pickup and drop"],
  [Headset, "Real people to help you"],
] as const

export function Home() {
  const { reviews } = site.use()
  return (
    <>
      <Hero />

      <section aria-label="Why book with us" className="border-b">
        <ul
          className={cn(
            container,
            "grid grid-cols-2 gap-x-4 gap-y-3 py-6 md:grid-cols-4"
          )}
        >
          {promises.map(([Icon, label], i) => (
            <li key={label}>
              <Reveal
                delay={i * 70}
                className="flex items-center gap-2.5 leading-tight"
              >
                <Icon className="size-6 shrink-0 text-primary" />
                {label}
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="border-t">
          <Reveal className={cn(container, "py-4")}>
            <Ratings compact />
          </Reveal>
        </div>
      </section>

      <section className={cn(container, "py-14")}>
        <Reveal className="flex items-baseline justify-between gap-4">
          <h2 className={sectionTitle}>Popular day tours</h2>
          <Link href="/tours" className={textLink}>
            View all
          </Link>
        </Reveal>
        <TourGrid limit={6} />
      </section>

      <section className="bg-muted">
        <div className={cn(container, "py-14")}>
          <Reveal className="flex items-baseline justify-between gap-4">
            <h2 className={sectionTitle}>What travellers say</h2>
            <Link href="/reviews" className={textLink}>
              All reviews
            </Link>
          </Reveal>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r, i) => (
              <li key={r.id}>
                <Reveal delay={i * 100} className="h-full">
                  <ReviewCard review={r} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CompanySection />

      <section className="bg-muted">
        <div className={cn(container, "py-14")}>
          <Reveal>
            <h2 className={sectionTitle}>How booking works</h2>
          </Reveal>
          <Steps />
        </div>
      </section>

      <AskUs />
    </>
  )
}

export function Tours() {
  return (
    <main className={cn(container, "py-10 text-center md:py-14")}>
      <div className="animate-in duration-700 fade-in slide-in-from-bottom-4">
        <h1 className={pageTitle}>Day tours in Thailand</h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-lg leading-snug text-muted-foreground">
          Add the tours you like to your trip. Tap any tour to see its timing
          and what is included.
        </p>
      </div>
      <TourGrid filters />
    </main>
  )
}

export function About() {
  const { company, tours } = site.use()
  const places = [...new Set(tours.map((t) => t.location))]
  return (
    <main className="text-center">
      <section
        className={cn(
          container,
          "animate-in py-10 duration-700 fade-in slide-in-from-bottom-4 md:py-14"
        )}
      >
        <h1 className={pageTitle}>About {company.name}</h1>
        <p className="mx-auto mt-4 max-w-[60ch] text-lg leading-relaxed sm:text-xl">
          {company.about}
        </p>
      </section>
      <Reveal className={container}>
        <img
          src="/images/phi-phi-2.jpg"
          alt="Turquoise water at Maya Bay, Phi Phi, seen from a sea cave"
          className="aspect-[4/3] w-full rounded-md object-cover md:aspect-[5/2]"
        />
      </Reveal>
      <section className={cn(container, "py-14")}>
        <Reveal>
          <h2 className={sectionTitle}>What we care about</h2>
        </Reveal>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {reasons.map(([title, text], i) => (
            <li key={title}>
              <Reveal delay={i * 100}>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="mt-1 leading-snug text-muted-foreground">
                  {text}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-muted">
        <Reveal className={cn(container, "py-14")}>
          <h2 className={sectionTitle}>Where we run tours</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xl">
            {places.map((p) => (
              <li key={p}>
                <Link href="/tours" className="hover:underline">
                  {p}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      <AskUs />
    </main>
  )
}

export function Reviews() {
  const { reviews, tours } = site.use()
  // undefined = closed, null = new review
  const [writing, setWriting] = useState<null | undefined>(undefined)
  const [featured, ...rest] = reviews
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) / reviews.length
    : 0
  const photo =
    featured &&
    (featured.photo ?? tours.find((t) => t.title === featured.tour)?.images[0])

  return (
    <main className="text-center">
      <section className="bg-primary text-white">
        <div className={cn(container, "py-12 md:py-16")}>
          <div className="animate-in duration-700 fade-in slide-in-from-bottom-4">
            <h1 className={pageTitle}>Reviews from travellers</h1>
            <p className="mx-auto mt-3 max-w-[44ch] text-lg leading-snug">
              Couples, families and friends from across India, on what their day
              tours were like.
            </p>
            {reviews.length > 0 && (
              <div className="mt-6">
                <p className="text-6xl font-normal">{average.toFixed(1)}</p>
                <Stars value={average} className="mt-1" />
                <p className="mt-1">
                  From {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            )}
            <Button
              size="lg"
              variant="secondary"
              className="mt-6"
              onClick={() => setWriting(null)}
            >
              Write a review
            </Button>
          </div>
          <div className="mx-auto mt-8 max-w-3xl animate-in duration-1000 fade-in slide-in-from-bottom-6">
            <Ratings onDark />
          </div>
        </div>
      </section>

      {!featured ? (
        <p className={cn(container, "py-14 text-lg text-muted-foreground")}>
          No reviews yet. Yours could be the first.
        </p>
      ) : (
        <>
          <section className={cn(container, "py-12 md:py-16")}>
            <Reveal className="mx-auto max-w-3xl">
              {photo && (
                <img
                  src={photo}
                  alt=""
                  className="aspect-[16/9] w-full rounded-lg object-cover shadow-md"
                />
              )}
              <Stars value={featured.rating ?? 5} className="mt-6" />
              <blockquote className="mt-3 text-2xl leading-snug font-normal tracking-tight sm:text-3xl">
                “{featured.quote}”
              </blockquote>
              <p className="mt-4 text-lg font-medium">
                {featured.name}, {featured.city}
              </p>
              <p className="text-muted-foreground">{featured.tour}</p>
            </Reveal>
          </section>

          {rest.length > 0 && (
            <section className="bg-muted">
              <div className={cn(container, "py-12 md:py-16")}>
                <Reveal>
                  <h2 className={sectionTitle}>More from our travellers</h2>
                </Reveal>
                <ul className="mt-6 columns-1 gap-5 text-left sm:columns-2 lg:columns-3">
                  {rest.map((r, i) => (
                    <li key={r.id} className="mb-5 break-inside-avoid">
                      <Reveal delay={(i % 3) * 90}>
                        <ReviewCard review={r} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}
      <AskUs />
      <ReviewForm review={writing} onClose={() => setWriting(undefined)} />
    </main>
  )
}

export function Contact() {
  const { whatsapp } = site.use()
  return (
    <main className={cn(container, "py-10 text-center md:py-14")}>
      <div className="animate-in duration-700 fade-in slide-in-from-bottom-4">
        <h1 className={pageTitle}>Contact us</h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-lg leading-snug text-muted-foreground">
          WhatsApp is the fastest way to reach us. Ask anything, even if you
          have not picked your tours yet.
        </p>
        <Button
          size="lg"
          className="mt-6 bg-leaf text-foreground hover:bg-leaf/85"
          render={
            <a
              href={`https://wa.me/${digits(whatsapp)}`}
              target="_blank"
              rel="noreferrer"
            />
          }
          nativeButton={false}
        >
          <MessageCircle />
          Chat on WhatsApp
        </Button>
      </div>

      <Reveal>
        <CompanyDetails
          centered
          className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3"
        />
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-3xl">
        <section>
          <h2 className={sectionTitle}>Common questions</h2>
          <Accordion className="mt-4 text-left">
            {faqs.map(([question, answer]) => (
              <AccordionItem key={question} value={question!}>
                <AccordionTrigger className="text-lg font-normal">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </Reveal>
    </main>
  )
}

function CompanyDetails({
  className,
  centered,
}: {
  className?: string
  centered?: boolean
}) {
  const { company } = site.use()
  const details = [
    [MapPin, "Office", company.address],
    [Clock, "Hours", company.hours],
    [Mail, "Email", company.email],
  ] as const
  return (
    <ul className={className}>
      {details.map(([Icon, label, value]) => (
        <li
          key={label}
          className={cn(
            "flex gap-3",
            centered && "flex-col items-center gap-1"
          )}
        >
          <Icon className="mt-1 size-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-medium">{label}</h3>
            <p className="break-words text-muted-foreground">{value}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function CompanySection() {
  const { company, tours } = site.use()
  const places = [...new Set(tours.map((t) => t.location))]
  return (
    <section>
      <div
        className={cn(container, "grid gap-8 py-14 md:grid-cols-2 md:gap-12")}
      >
        <Reveal>
          <h2 className={sectionTitle}>About {company.name}</h2>
          <p className="mt-4 text-lg leading-relaxed">{company.about}</p>
          <p className="mt-4 text-lg">
            <span className="font-medium">Where we run tours: </span>
            {places.join(", ")}
          </p>
          <CompanyDetails className="mt-6 space-y-4" />
          <Link href="/about" className={cn(textLink, "mt-6 inline-block")}>
            More about us
          </Link>
        </Reveal>
        <Reveal delay={120}>
          <img
            src="/images/phi-phi-2.jpg"
            alt="Turquoise water at Maya Bay, Phi Phi, seen from a sea cave"
            className="aspect-[3/2] size-full rounded-md object-cover"
          />
        </Reveal>
      </div>
    </section>
  )
}

function Steps() {
  return (
    <ol className="mt-6 grid gap-6 sm:grid-cols-3">
      {steps.map(([title, text], i) => (
        <li key={title}>
          <Reveal delay={i * 120}>
            <span className="text-2xl text-primary">{i + 1}</span>
            <h3 className="mt-1 text-lg font-medium">{title}</h3>
            <p className="leading-snug text-muted-foreground">{text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

function AskUs() {
  return (
    <section className={cn(container, "py-14 text-center")}>
      <Reveal>
        <h2 className={sectionTitle}>Not sure what to pick?</h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-lg leading-snug text-muted-foreground">
          Tell us your dates and who is travelling, and we will suggest day
          tours that fit.
        </p>
        <Button
          size="lg"
          className="mt-5"
          render={<Link href="/contact" />}
          nativeButton={false}
        >
          Contact us
        </Button>
      </Reveal>
    </section>
  )
}

function TourGrid({ limit, filters }: { limit?: number; filters?: boolean }) {
  const { tours } = site.use()
  const ids = cart.use()
  const [place, setPlace] = useState("All")
  // Kept after closing so the dialog still has content while it animates out.
  const [viewing, setViewing] = useState<Tour | null>(null)
  const [open, setOpen] = useState(false)

  const places = useMemo(
    () => [...new Set(tours.map((t) => t.location))],
    [tours]
  )
  const shown = (
    place === "All" ? tours : tours.filter((t) => t.location === place)
  ).slice(0, limit)

  return (
    <>
      {filters && (
        <div
          role="group"
          aria-label="Filter by place"
          className="-mx-4 mt-6 flex gap-5 overflow-x-auto border-b px-4 sm:mx-0 sm:justify-center sm:px-0"
        >
          {["All", ...places].map((p) => (
            <button
              key={p}
              aria-pressed={place === p}
              onClick={() => setPlace(p)}
              className={cn(
                "-mb-px shrink-0 border-b-2 py-2.5 text-[1.05rem] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                place === p
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="mt-8 text-lg text-muted-foreground">
          No tours here right now. Message us on WhatsApp and we will find you
          one.
        </p>
      ) : (
        <ul
          key={place}
          className="mt-8 grid gap-x-6 gap-y-10 text-left sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((t, i) => {
            const added = ids.includes(t.id)
            return (
              <li key={t.id}>
                <Reveal delay={(i % 3) * 90} className="h-full">
                  <TourCard
                    tour={t}
                    onOpen={() => {
                      setViewing(t)
                      setOpen(true)
                    }}
                  >
                    <Button
                      variant={added ? "secondary" : "default"}
                      onClick={() => toggleInCart(t.id)}
                      aria-pressed={added}
                      aria-label={`${added ? "Remove" : "Add"} ${t.title} ${added ? "from" : "to"} my trip`}
                    >
                      <span
                        key={String(added)}
                        className="inline-flex animate-in duration-300 spin-in-12 zoom-in"
                      >
                        {added ? (
                          <Check className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </span>
                      {added ? "Added" : "Add"}
                    </Button>
                  </TourCard>
                </Reveal>
              </li>
            )
          })}
        </ul>
      )}

      <TourDetails
        tour={viewing}
        open={open}
        onClose={() => setOpen(false)}
        added={!!viewing && ids.includes(viewing.id)}
      />
    </>
  )
}
