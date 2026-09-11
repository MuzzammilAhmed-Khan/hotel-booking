# Alloy Grand Hotel — Static Booking Site

A fully static hotel booking website: room browsing, filtering, and a client-side booking
flow with live price calculation and a mock confirmation (no backend — bookings are
saved to `localStorage` for demo purposes).

## Structure

- `index.html` — home page with hero search widget, featured rooms, amenities, testimonials
- `rooms.html` — full room listing with type filters and sorting
- `booking.html` — booking form with live nightly-rate summary and confirmation
- `about.html`, `contact.html` — supporting pages
- `css/style.css` — all styling (single stylesheet, CSS variables for theme)
- `js/config.js` — **hotel name, phone, email, address, front-desk hours, homepage stats.** Edit this one file to rebrand the site; every page picks it up automatically via `data-cfg` attributes.
- `js/rooms-data.js` — **room inventory.** Add/remove objects in the `ROOMS` array to change the number of rooms or room types; edit a room's `price` field to change its nightly rate. All pages (home, rooms, booking) read from this one array.
- `js/rooms.js`, `js/booking.js`, `js/contact.js`, `js/main.js` — page behavior

### Changing business details

Everything editable lives in two files:

| To change...                          | Edit...              |
|----------------------------------------|-----------------------|
| Hotel name / tagline                   | `js/config.js`        |
| Phone / email                          | `js/config.js`        |
| Address                                | `js/config.js`        |
| Front desk hours                       | `js/config.js`        |
| Homepage stats (room count shown, rating, years) | `js/config.js` |
| Number of rooms / room types           | `js/rooms-data.js` (add or remove entries in `ROOMS`) |
| Room prices                            | `js/rooms-data.js` (`price` field per room) |

## Local preview

No build step required. Serve the folder with any static server, e.g.:

```
npx serve .
```

## Deployment

Hosted on Cloudflare Pages at **hotels.paperalloy.app**, deployed straight from this
repository's `main` branch (root directory, no build command/output directory needed).
