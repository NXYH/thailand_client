import assert from "node:assert/strict"
import { test } from "node:test"
import { bookingMessage, rupees, tripTotal, validMobile, whatsappUrl } from "./booking.ts"
import { seedTours, type Tour } from "./tours.ts"

const [phi, , , , doi] = seedTours as [Tour, Tour, Tour, Tour, Tour]
const customer = { name: " Priya ", mobile: "+91 98200 12345", people: 2, arrival: "2026-12-01" }

test("total uses the discount when there is one, for every person", () => {
  assert.equal(tripTotal([phi, doi], 2), (3499 + 1800) * 2)
})

test("rupees use Indian digit grouping", () => {
  assert.equal(rupees(123456), "₹1,23,456")
})

test("message carries customer, tours and total", () => {
  const m = bookingMessage([phi, doi], customer)
  assert.match(m, /\*Name:\* Priya\n/)
  assert.match(m, /\*People:\* 2/)
  assert.match(m, /1 December 2026/)
  assert.match(m, /1\. \*Phi Phi Island boat trip\* \(Phuket\)/)
  assert.match(m, /₹3,499 x 2 = ₹6,998/)
  assert.match(m, /2\. \*Doi Suthep temple evening\*/)
  assert.match(m, /Estimated total: ₹10,598/)
})

test("arrival line is left out when blank", () => {
  assert.doesNotMatch(bookingMessage([phi], { ...customer, arrival: "" }), /Arriving/)
})

test("whatsapp link strips the phone and encodes the text", () => {
  assert.equal(whatsappUrl("+66 81-234", "a & b\n"), "https://wa.me/6681234?text=a%20%26%20b%0A")
})

test("mobile validation", () => {
  for (const ok of ["9820012345", "+91 98200 12345", "+66 (81) 234-5678"]) assert.ok(validMobile(ok), ok)
  for (const bad of ["12345", "abcdefghijkl", ""]) assert.ok(!validMobile(bad), bad)
})
