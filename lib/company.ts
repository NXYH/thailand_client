export type Company = {
  name: string
  tagline: string
  about: string
  email: string
  address: string
  hours: string
}

export type Review = {
  id: string
  name: string
  city: string
  tour: string
  quote: string
  rating: number
  photo?: string
}

/** `sample` keeps a "Sample ratings" label on the website until the owner enters a real number. */
export type Listing = { name: string; rating: number | null; url: string; sample: boolean }

// Sample content so the demo looks complete. All of it is replaced from /admin before going live.
export const seedCompany: Company = {
  name: "Chalo Thailand",
  tagline: "Thailand day tours for Indian travellers",
  about:
    "We help Indian travellers see the best of Thailand, one day at a time. No fixed packages and no long forms. Pick the tours you like, tell us who is coming, and we sort out the pickups, the boats and the meals.",
  email: "hello@example.com",
  address: "Phuket, Thailand",
  hours: "9:00 AM to 8:00 PM Thailand time, every day",
}

export const seedReviews: Review[] = [
  {
    id: "r1",
    rating: 5,
    name: "Neha and Rohan",
    city: "Pune",
    tour: "Phi Phi Island boat trip",
    quote:
      "We had no package and no plan. One quick chat later we had Phi Phi booked, and the pickup came right on time.",
  },
  {
    id: "r2",
    rating: 5,
    name: "Anjali Mehta",
    city: "Ahmedabad",
    tour: "Krabi 4 islands by long-tail",
    quote:
      "We are pure vegetarian, so food was my biggest worry. They arranged Jain meals on the boat without any fuss.",
  },
  {
    id: "r3",
    rating: 5,
    name: "Vikram Nair",
    city: "Kochi",
    tour: "Elephant sanctuary half day",
    quote:
      "My parents and kids all came along and everyone loved it. Seeing the price in rupees made planning so easy.",
  },
  {
    id: "r4",
    rating: 4,
    name: "The Reddy family",
    city: "Hyderabad",
    tour: "Grand Palace and Wat Arun",
    quote:
      "The guide kept the kids interested for the whole day, and we changed our date in a couple of minutes.",
  },
  {
    id: "r5",
    rating: 5,
    name: "Priya and Arjun",
    city: "Bengaluru",
    tour: "James Bond Island and sea canoe",
    quote:
      "Our honeymoon highlight. The canoe through the caves was magical, and everything was sorted before we landed.",
  },
  {
    id: "r6",
    rating: 4,
    name: "Sandeep Kaur",
    city: "Chandigarh",
    tour: "Damnoen Saduak floating market",
    quote:
      "Early start but completely worth it. The driver was friendly and the prices were exactly what we were told.",
  },
  {
    id: "r7",
    rating: 5,
    name: "Farhan Shaikh",
    city: "Mumbai",
    tour: "White Temple day trip",
    quote:
      "A long day made easy. Comfortable van, a great guide, and we were dropped right back at our hotel.",
  },
  {
    id: "r8",
    rating: 5,
    name: "Meera Iyer",
    city: "Chennai",
    tour: "Sanctuary of Truth and Koh Larn",
    quote:
      "I travelled with my mother and they took such good care of us. We have already booked again for next year.",
  },
]

export const seedListings: Listing[] = [
  { name: "Google Maps", rating: 4.8, url: "", sample: true },
  { name: "Tripadvisor", rating: 4.7, url: "", sample: true },
  { name: "Trustpilot", rating: 4.6, url: "", sample: true },
  { name: "Agoda", rating: 4.5, url: "", sample: true },
]

export const faqs = [
  ["How do I book a tour?", "Add the tours you like to your trip, enter your details and send them on WhatsApp. We reply there to confirm dates and availability."],
  ["Do I pay on the website?", "No. Nothing is charged on this website. We share payment options on WhatsApp once your tours are confirmed."],
  ["Are prices per person?", "Yes. Every price is per person in rupees, and your trip shows the estimated total for your group."],
  ["Can you arrange vegetarian or Jain food?", "Yes, on tours that include lunch. Mention it on WhatsApp so we can arrange it."],
  ["Can I change my date?", "Yes. Message us on WhatsApp and we will check what is available."],
]
