// Shared room inventory used by the home, rooms, and booking pages.
const ROOMS = [
  {
    id: "standard-queen",
    name: "Standard Queen Room",
    type: "Standard",
    price: 3499,
    capacity: 2,
    size: 24,
    theme: "grad-1",
    tagline: "Cozy comfort for the essentials traveler",
    description:
      "A bright, efficiently designed room with a plush queen bed, city views, and everything you need for a restful stay.",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Work Desk"],
  },
  {
    id: "standard-twin",
    name: "Standard Twin Room",
    type: "Standard",
    price: 3999,
    capacity: 2,
    size: 26,
    theme: "grad-2",
    tagline: "Two beds, twice the flexibility",
    description:
      "Ideal for friends or colleagues traveling together, featuring two comfortable twin beds and a walk-in shower.",
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Fridge", "Work Desk"],
  },
  {
    id: "deluxe-king",
    name: "Deluxe King Room",
    type: "Deluxe",
    price: 5999,
    capacity: 2,
    size: 34,
    theme: "grad-3",
    tagline: "Elevated comfort with a view",
    description:
      "A spacious king room with a seating area, upgraded bath amenities, and panoramic views of the skyline.",
    amenities: ["Free Wi-Fi", "Mini Bar", "Bathtub", "Lounge Chair", "Coffee Machine"],
  },
  {
    id: "deluxe-family",
    name: "Deluxe Family Room",
    type: "Deluxe",
    price: 7499,
    capacity: 4,
    size: 42,
    theme: "grad-4",
    tagline: "Room to relax, together",
    description:
      "A generous layout with a king bed and a sofa bed, perfect for families who want extra space without compromise.",
    amenities: ["Free Wi-Fi", "Mini Bar", "Sofa Bed", "Bathtub", "Kids' Amenities"],
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    type: "Suite",
    price: 9999,
    capacity: 3,
    size: 50,
    theme: "grad-5",
    tagline: "A separate living space, all your own",
    description:
      "An open-plan suite with a distinct lounge area, premium linens, and a marble bathroom with a rainfall shower.",
    amenities: ["Free Wi-Fi", "Lounge Area", "Rainfall Shower", "Nespresso Machine", "Bathrobe & Slippers"],
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    type: "Suite",
    price: 12999,
    capacity: 3,
    size: 58,
    theme: "grad-6",
    tagline: "Refined space for work and rest",
    description:
      "A polished suite with a private study, king bed, and floor-to-ceiling windows overlooking the city lights.",
    amenities: ["Free Wi-Fi", "Private Study", "Mini Bar", "Bathtub", "Evening Turndown"],
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    type: "Suite",
    price: 24999,
    capacity: 4,
    size: 85,
    theme: "grad-7",
    tagline: "The pinnacle of Alloy Grand hospitality",
    description:
      "Our signature suite with a private dining area, spa-inspired bathroom, and dedicated butler service on request.",
    amenities: ["Free Wi-Fi", "Private Dining", "Jacuzzi", "Butler Service", "Panoramic Terrace"],
  },
  {
    id: "accessible-room",
    name: "Accessible Queen Room",
    type: "Standard",
    price: 3499,
    capacity: 2,
    size: 28,
    theme: "grad-8",
    tagline: "Thoughtfully designed for every guest",
    description:
      "A wheelchair-accessible room with a roll-in shower, wider doorways, and all the comforts of our Standard rooms.",
    amenities: ["Free Wi-Fi", "Roll-in Shower", "Air Conditioning", "Grab Bars"],
  },
];

function formatCurrency(amount) {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function getRoomById(id) {
  return ROOMS.find((room) => room.id === id);
}

function formatDateForWhatsApp(iso) {
  if (!iso) return "Flexible";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// Sensible fallback dates (tonight → tomorrow) for when no dates were
// searched yet, so the WhatsApp message always shows something concrete.
function defaultBookingDates() {
  const toISO = (d) => d.toISOString().split("T")[0];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { checkin: toISO(today), checkout: toISO(tomorrow) };
}

function buildWhatsAppLink(room, checkin, checkout, guests) {
  const lines = [
    `Hi ${SITE_CONFIG.fullName}! I'd like to book the *${room.name}* (${formatCurrency(room.price)}/night).`,
    "",
    `Check-in: ${formatDateForWhatsApp(checkin)}`,
    `Check-out: ${formatDateForWhatsApp(checkout)}`,
    `Guests: ${guests}`,
    "",
    "Please let me know availability. Thank you!",
  ];
  const text = encodeURIComponent(lines.join("\n"));
  const digitsOnly = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${text}`;
}
