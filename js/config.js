// ===================================================================
// SITE CONFIG — edit these values to rebrand the site. No other files
// need to change. (Room count & prices live in js/rooms-data.js.)
// ===================================================================
const SITE_CONFIG = {
  shortName: "Alloy Grand",      // shown in the nav bar / footer brand
  fullName: "Alloy Grand Hotel", // shown in headings, titles, copyright
  tagline: "Boutique hospitality in the heart of downtown. Elegant rooms, warm service, unforgettable stays.",

  phone: "+1 (555) 234-5678",
  email: "reservations@alloygrandhotel.example",

  // Number that "Book Now" buttons message on WhatsApp. Any format works
  // (with or without "+", spaces, dashes) — just include the country code.
  whatsappNumber: "+91 78422 87755",

  addressShort: "123 Skyline Avenue, Downtown District",
  addressFull: "123 Skyline Avenue, Downtown District, Metro City 10001",

  frontDeskHours: "Available 24 hours, every day of the week",

  // Marketing stats shown on the homepage — update freely.
  stats: {
    totalRooms: "64",
    guestRating: "4.8/5",
    yearsOpen: "15+",
  },

  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
};

// Fills in every element tagged data-cfg="<dot.path>" with the matching
// value above, and data-cfg-attr="attrName:<dot.path>" for attributes.
function applySiteConfig() {
  const get = (path) => path.split(".").reduce((obj, key) => (obj ? obj[key] : undefined), SITE_CONFIG);

  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const value = get(el.getAttribute("data-cfg"));
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll("[data-cfg-attr]").forEach((el) => {
    const [attr, path] = el.getAttribute("data-cfg-attr").split(":");
    const value = get(path);
    if (value !== undefined) el.setAttribute(attr, value);
  });

  document.title = document.title.replaceAll("Alloy Grand Hotel", SITE_CONFIG.fullName);
}

document.addEventListener("DOMContentLoaded", applySiteConfig);
