/* eslint-disable @next/next/no-img-element -- tour photos can be any URL or an uploaded data URL */
"use client"

import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  bookingMessage,
  rupees,
  salePrice,
  tripTotal,
  validMobile,
  whatsappUrl,
} from "@/lib/booking"
import { site, toggleInCart } from "@/lib/store"
import type { Tour } from "@/lib/tours"

export function TripSheet({
  open,
  onOpenChange,
  tours,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tours: Tour[]
}) {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [arrival, setArrival] = useState("")
  const [people, setPeople] = useState(2)
  const [mobileError, setMobileError] = useState(false)

  function send(e: React.FormEvent) {
    e.preventDefault()
    if (!validMobile(mobile)) return setMobileError(true)
    const text = bookingMessage(tours, { name, mobile, people, arrival })
    window.open(whatsappUrl(site.get().whatsapp, text), "_blank", "noopener")
    toast.success("Opening WhatsApp. Press send to share your trip with us.")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b pr-12">
          <SheetTitle className="text-2xl font-medium">My trip</SheetTitle>
          <SheetDescription className="text-base">
            {tours.length === 0
              ? "Nothing here yet."
              : `${tours.length} ${tours.length === 1 ? "tour" : "tours"}, prices per person`}
          </SheetDescription>
        </SheetHeader>

        {tours.length === 0 ? (
          <div className="p-6 text-lg">
            <p>Add a day tour and it shows up here.</p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>
              Browse day tours
            </Button>
          </div>
        ) : (
          <form onSubmit={send} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-4">
              <ul className="divide-y">
                {tours.map((t) => (
                  <li
                    key={t.id}
                    className="flex animate-in items-center gap-3 py-3 duration-300 fade-in slide-in-from-right-3 first:pt-0"
                  >
                    <img
                      src={t.images[0]}
                      alt=""
                      className="size-16 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="font-medium">{t.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.location}
                      </p>
                      <p>{rupees(salePrice(t))}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${t.title}`}
                      onClick={() => toggleInCart(t.id)}
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <Label className="text-base font-medium" id="people-label">
                  Number of people
                </Label>
                <div
                  role="group"
                  aria-labelledby="people-label"
                  className="flex items-center gap-3"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="One person fewer"
                    disabled={people <= 1}
                    onClick={() => setPeople(people - 1)}
                  >
                    <Minus />
                  </Button>
                  <span
                    key={people}
                    aria-live="polite"
                    className="w-6 animate-in text-center text-lg font-medium duration-200 zoom-in-75"
                  >
                    {people}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="One person more"
                    onClick={() => setPeople(people + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-base font-medium">
                  Your name
                </Label>
                <Input
                  id="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-base font-medium">
                  Mobile number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+91 98200 12345"
                  aria-invalid={mobileError}
                  aria-describedby={mobileError ? "mobile-error" : undefined}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value)
                    setMobileError(false)
                  }}
                />
                {mobileError && (
                  <p id="mobile-error" className="font-medium text-destructive">
                    Enter a mobile number with at least 10 digits.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="arrival" className="text-base font-medium">
                  Arriving in Thailand (optional)
                </Label>
                <Input
                  id="arrival"
                  type="date"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 border-t p-4">
              <p className="flex items-baseline justify-between">
                <span className="text-muted-foreground">
                  Estimated total for {people}{" "}
                  {people === 1 ? "person" : "people"}
                </span>
                <span className="text-2xl font-medium">
                  {rupees(tripTotal(tours, people))}
                </span>
              </p>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-leaf text-foreground hover:bg-leaf/85"
              >
                <MessageCircle />
                Send on WhatsApp
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
