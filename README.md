# Chalo Thailand

Thailand day tours for Indian travellers. Customers pick tours, add their details and send the booking to the company on WhatsApp.

```bash
npm install
npm run dev     # website at localhost:3000, admin at /admin, also works from a phone on the same Wi-Fi
npm test        # booking message and price checks
```

This is a demo with no database or login. Admin changes are saved in the browser's localStorage, so they only appear in that browser. To go live, replace `lib/store.ts` with a real backend and protect `/admin`.

Sample photos are from Wikimedia Commons (see `public/images/CREDITS.txt`). The company name, tours, prices, company details and customer reviews and platform ratings are all sample content. Replace them in `/admin` before going live: the reviews and ratings are made up and must not be published as real.
