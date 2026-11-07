export type Tour = {
  id: string
  title: string
  location: string
  description: string
  timing: string
  inclusions: string[]
  exclusions: string[]
  price: number
  discountPrice: number | null
  images: string[]
}

const stay = ["Hotel pickup and drop", "Veg and Jain lunch on request"]
const skip = ["Flights and hotel stay", "Personal shopping and tips"]

export const seedTours: Tour[] = [
  {
    id: "phi-phi",
    title: "Phi Phi Island boat trip",
    location: "Phuket",
    description:
      "A full day by speedboat to Maya Bay, Pileh Lagoon and Viking Cave, with time to swim and snorkel in clear water and lunch on Phi Phi Don.",
    timing: "7:30 AM to 5:00 PM",
    inclusions: [...stay, "Speedboat with life jackets", "Snorkel gear", "National park fee"],
    exclusions: skip,
    price: 4200,
    discountPrice: 3499,
    images: ["/images/phi-phi-1.jpg", "/images/phi-phi-2.jpg", "/images/phi-phi-3.jpg"],
  },
  {
    id: "james-bond",
    title: "James Bond Island and sea canoe",
    location: "Phuket",
    description:
      "Cruise through Phang Nga Bay, paddle a canoe into limestone caves and stand in front of the famous Khao Tapu rock.",
    timing: "8:00 AM to 5:30 PM",
    inclusions: [...stay, "Long-tail boat", "Sea canoe with paddler", "National park fee"],
    exclusions: skip,
    price: 4500,
    discountPrice: 3799,
    images: ["/images/james-bond-1.jpg", "/images/james-bond-2.jpg", "/images/james-bond-3.jpg"],
  },
  {
    id: "krabi-four-islands",
    title: "Krabi 4 islands by long-tail",
    location: "Krabi",
    description:
      "Hop between Koh Poda, Chicken Island, Tup Island and Phra Nang Cave Beach. At low tide you can walk across the sandbar.",
    timing: "8:30 AM to 4:00 PM",
    inclusions: [...stay, "Long-tail boat", "Snorkel gear", "Drinking water and fruit"],
    exclusions: [...skip, "National park fee (about ₹800)"],
    price: 2800,
    discountPrice: 2299,
    images: ["/images/krabi-2.jpg", "/images/krabi-1.jpg", "/images/krabi-3.jpg"],
  },
  {
    id: "elephant-sanctuary",
    title: "Elephant sanctuary half day",
    location: "Chiang Mai",
    description:
      "Feed rescued elephants, walk beside them through the forest and watch them bathe in the river. No riding, no shows.",
    timing: "8:00 AM to 1:00 PM",
    inclusions: [...stay, "Sanctuary entry", "Fruit for feeding", "Change of clothes for the river"],
    exclusions: skip,
    price: 3900,
    discountPrice: 3499,
    images: ["/images/elephant-1.jpg", "/images/elephant-2.jpg"],
  },
  {
    id: "doi-suthep",
    title: "Doi Suthep temple evening",
    location: "Chiang Mai",
    description:
      "Ride up the mountain to Chiang Mai's golden temple, see the sun set over the city and stay for the evening chanting.",
    timing: "3:30 PM to 7:30 PM",
    inclusions: ["Hotel pickup and drop", "Temple entry", "English-speaking guide"],
    exclusions: [...skip, "Dinner"],
    price: 1800,
    discountPrice: null,
    images: ["/images/doi-suthep-1.jpg", "/images/doi-suthep-2.jpg"],
  },
  {
    id: "white-temple",
    title: "White Temple day trip",
    location: "Chiang Mai",
    description:
      "A long day north to Wat Rong Khun, the Blue Temple and the Golden Triangle viewpoint, where Thailand meets Laos and Myanmar.",
    timing: "7:00 AM to 8:00 PM",
    inclusions: [...stay, "Air-conditioned van", "Temple entry", "English-speaking guide"],
    exclusions: skip,
    price: 3400,
    discountPrice: 2899,
    images: ["/images/white-temple-1.jpg", "/images/white-temple-2.jpg"],
  },
  {
    id: "bangkok-temples",
    title: "Grand Palace and Wat Arun",
    location: "Bangkok",
    description:
      "See the Emerald Buddha, the Reclining Buddha at Wat Pho, and cross the Chao Phraya by boat to Wat Arun.",
    timing: "8:00 AM to 3:00 PM",
    inclusions: [...stay, "All temple entry fees", "River ferry", "English-speaking guide"],
    exclusions: skip,
    price: 2600,
    discountPrice: 2199,
    images: ["/images/bangkok-1.jpg", "/images/bangkok-2.jpg", "/images/bangkok-3.jpg"],
  },
  {
    id: "floating-market",
    title: "Damnoen Saduak floating market",
    location: "Bangkok",
    description:
      "Glide through the canals in a paddle boat, buy mango sticky rice from the vendors and watch the train pass through Maeklong market.",
    timing: "6:30 AM to 1:30 PM",
    inclusions: ["Hotel pickup and drop", "Paddle boat ride", "Air-conditioned van"],
    exclusions: [...skip, "Lunch"],
    price: 2400,
    discountPrice: 1999,
    images: ["/images/market-1.jpg", "/images/market-2.jpg", "/images/market-3.jpg"],
  },
  {
    id: "ayutthaya",
    title: "Ayutthaya old capital",
    location: "Bangkok",
    description:
      "Walk among the temple ruins of Thailand's old capital, find the Buddha head in the tree roots at Wat Mahathat and ride back on the river.",
    timing: "7:30 AM to 5:30 PM",
    inclusions: [...stay, "Temple entry fees", "River cruise", "English-speaking guide"],
    exclusions: skip,
    price: 2900,
    discountPrice: null,
    images: ["/images/ayutthaya-1.jpg", "/images/ayutthaya-2.jpg", "/images/ayutthaya-3.jpg"],
  },
  {
    id: "pattaya-truth",
    title: "Sanctuary of Truth and Koh Larn",
    location: "Pattaya",
    description:
      "Morning at Koh Larn's beaches by speedboat, then a guided walk through the giant hand-carved wooden temple by the sea.",
    timing: "8:00 AM to 4:30 PM",
    inclusions: [...stay, "Speedboat to Koh Larn", "Sanctuary entry"],
    exclusions: [...skip, "Water sports"],
    price: 3200,
    discountPrice: 2699,
    images: ["/images/pattaya-1.jpg", "/images/pattaya-2.jpg"],
  },
]
