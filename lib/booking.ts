import type { Tour } from "./tours.ts"

export type Customer = { name: string; mobile: string; people: number; arrival: string }

export const salePrice = (t: Tour) => t.discountPrice ?? t.price

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN")

export const validMobile = (s: string) => /^\+?[\d\s()-]{10,20}$/.test(s) && digits(s).length >= 10

export const digits = (s: string) => s.replace(/\D/g, "")

export const tripTotal = (tours: Tour[], people: number) =>
  tours.reduce((sum, t) => sum + salePrice(t), 0) * people

export function bookingMessage(tours: Tour[], c: Customer) {
  const lines = tours.flatMap((t, i) => [
    `${i + 1}. *${t.title}* (${t.location})`,
    `   ${t.timing}`,
    `   ${rupees(salePrice(t))} x ${c.people} = ${rupees(salePrice(t) * c.people)}`,
    "",
  ])
  // Date inputs give yyyy-mm-dd, which parses as UTC, so format in UTC or it can slip a day.
  const arrival =
    c.arrival &&
    new Date(c.arrival).toLocaleDateString("en-IN", { dateStyle: "long", timeZone: "UTC" })

  return [
    "*New day tour booking*",
    "",
    `*Name:* ${c.name.trim()}`,
    `*Mobile:* ${c.mobile.trim()}`,
    `*People:* ${c.people}`,
    ...(arrival ? [`*Arriving in Thailand:* ${arrival}`] : []),
    "",
    "*Tours selected:*",
    ...lines,
    `*Estimated total: ${rupees(tripTotal(tours, c.people))}*`,
  ].join("\n")
}

// ponytail: no saved number falls back to WhatsApp's contact picker instead of a dead button.
export const whatsappUrl = (phone: string, text: string) =>
  `https://wa.me/${digits(phone)}?text=${encodeURIComponent(text)}`
