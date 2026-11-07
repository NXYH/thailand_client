"use client"

import { useSyncExternalStore } from "react"
import { toast } from "sonner"

import {
  seedCompany,
  seedListings,
  seedReviews,
  type Company,
  type Listing,
  type Review,
} from "@/lib/company"
import { seedTours, type Tour } from "@/lib/tours"

// ponytail: localStorage instead of a DB, as this is a demo. Admin edits only reach this browser.
// A real backend replaces this file; components only touch use/get/set.
function persisted<T>(key: string, initial: T) {
  let raw: string | null = null
  let value = initial
  const listeners = new Set<() => void>()

  const get = () => {
    try {
      const next = localStorage.getItem(key)
      if (next !== raw) {
        raw = next
        // Merge so data saved before a new field existed still gets that field.
        const saved = next ? JSON.parse(next) : initial
        value = Array.isArray(initial) ? saved : { ...initial, ...saved }
      }
    } catch {
      value = initial
    }
    return value
  }

  const subscribe = (fn: () => void) => {
    listeners.add(fn)
    // Keeps the website live while the admin panel is open in another tab.
    window.addEventListener("storage", fn)
    return () => {
      listeners.delete(fn)
      window.removeEventListener("storage", fn)
    }
  }

  return {
    get,
    use: () => useSyncExternalStore(subscribe, get, () => initial),
    // Throws when storage is full. The admin panel catches that and tells the owner.
    set(next: T) {
      localStorage.setItem(key, JSON.stringify(next))
      listeners.forEach((fn) => fn())
    },
    reset() {
      localStorage.removeItem(key)
      listeners.forEach((fn) => fn())
    },
  }
}

export const site = persisted<{
  tours: Tour[]
  whatsapp: string
  company: Company
  reviews: Review[]
  listings: Listing[]
}>("chalo-site", {
  tours: seedTours,
  whatsapp: "",
  company: seedCompany,
  reviews: seedReviews,
  listings: seedListings,
})

export const cart = persisted<string[]>("chalo-cart", [])

export function toggleInCart(id: string) {
  const ids = cart.get()
  const adding = !ids.includes(id)
  cart.set(adding ? [...ids, id] : ids.filter((x) => x !== id))
  toast.success(adding ? "Added to your trip" : "Removed from your trip", { duration: 1500 })
}

export function saveSite(next: ReturnType<typeof site.get>) {
  try {
    site.set(next)
    return true
  } catch {
    toast.error("Storage is full, so this was not saved. Remove some uploaded photos and try again.")
    return false
  }
}
