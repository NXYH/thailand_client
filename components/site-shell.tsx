"use client"

import { Menu, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Wordmark } from "@/components/brand"
import { TripSheet } from "@/components/trip-sheet"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { rupees, salePrice } from "@/lib/booking"
import { cart, site } from "@/lib/store"
import { cn } from "@/lib/utils"

const nav = [
  ["/", "Home"],
  ["/tours", "Day tours"],
  ["/about", "About us"],
  ["/reviews", "Reviews"],
  ["/contact", "Contact"],
]

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { tours, company } = site.use()
  const ids = cart.use()
  const path = usePathname()
  const [tripOpen, setTripOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const picked = tours.filter((t) => ids.includes(t.id))
  const perPerson = picked.reduce((sum, t) => sum + salePrice(t), 0)

  const links = nav.map(([href, label]) => (
    <Link
      key={href}
      href={href}
      aria-current={path === href ? "page" : undefined}
      onClick={() => setMenuOpen(false)}
      className={cn(
        "relative rounded transition-colors outline-none after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:after:scale-x-100",
        path === href ? "font-medium text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  ))

  return (
    <>
      <title>{`${company.name}: ${company.tagline}`}</title>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2 md:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-6" />
            </Button>
            <Link href="/">
              <Wordmark />
            </Link>
          </div>
          <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
            {links}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="relative -mr-2"
            aria-label={`My trip, ${picked.length} ${picked.length === 1 ? "tour" : "tours"}`}
            onClick={() => setTripOpen(true)}
          >
            <ShoppingCart className="size-6" />
            {picked.length > 0 && (
              <span
                key={picked.length}
                className="absolute -top-0.5 -right-0.5 grid size-5 animate-in place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground duration-300 zoom-in-50"
              >
                {picked.length}
              </span>
            )}
          </Button>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="gap-0 p-6">
          <SheetTitle className="text-xl font-medium">Menu</SheetTitle>
          <nav aria-label="Mobile" className="mt-6 flex flex-col gap-4 text-xl">
            {links}
          </nav>
        </SheetContent>
      </Sheet>

      {children}

      <footer className={cn("border-t", picked.length > 0 && "pb-20")}>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <div>
            <Wordmark />
            <p className="mt-2 text-muted-foreground">{company.tagline}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2">
            {links}
          </nav>
          <div className="space-y-1 text-muted-foreground">
            <p>{company.address}</p>
            <a
              href={`mailto:${company.email}`}
              className="block underline underline-offset-2"
            >
              {company.email}
            </a>
            <a
              href="/images/CREDITS.txt"
              className="block text-sm underline underline-offset-2"
            >
              Photo credits
            </a>
          </div>
        </div>
      </footer>

      {picked.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 animate-in border-t bg-background shadow-lg duration-300 slide-in-from-bottom">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="leading-tight">
              <span className="block font-medium">
                {picked.length} {picked.length === 1 ? "tour" : "tours"} in your
                trip
              </span>
              <span className="text-sm text-muted-foreground">
                {rupees(perPerson)} per person
              </span>
            </p>
            <Button onClick={() => setTripOpen(true)}>
              <ShoppingCart />
              Review trip
            </Button>
          </div>
        </div>
      )}

      <TripSheet open={tripOpen} onOpenChange={setTripOpen} tours={picked} />
    </>
  )
}
