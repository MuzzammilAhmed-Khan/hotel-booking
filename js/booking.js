// Booking form: room selection, live price summary, validation, and mock confirmation.
(function () {
  const params = new URLSearchParams(window.location.search);
  const roomSelect = document.getElementById("room-select");
  const guestsSelect = document.getElementById("guests");
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const form = document.getElementById("booking-form");

  const TAX_RATE = 0.12;

  // Populate room dropdown
  roomSelect.innerHTML = ROOMS.map(
    (r) => `<option value="${r.id}">${r.name} — ${formatCurrency(r.price)}/night</option>`
  ).join("");

  const requestedRoom = params.get("room");
  if (requestedRoom && getRoomById(requestedRoom)) {
    roomSelect.value = requestedRoom;
  }

  function populateGuests() {
    const room = getRoomById(roomSelect.value);
    const max = room ? room.capacity : 4;
    const current = Number(guestsSelect.value) || 1;
    guestsSelect.innerHTML = Array.from({ length: max }, (_, i) => i + 1)
      .map((n) => `<option value="${n}">${n} Guest${n > 1 ? "s" : ""}</option>`)
      .join("");
    guestsSelect.value = Math.min(current, max);
  }

  // Dates: default check-in to today, check-out to tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const toISO = (d) => d.toISOString().split("T")[0];

  checkinInput.min = toISO(today);
  checkinInput.value = params.get("checkin") && params.get("checkin") >= toISO(today) ? params.get("checkin") : toISO(today);
  checkoutInput.min = toISO(tomorrow);
  checkoutInput.value = params.get("checkout") || toISO(tomorrow);

  function syncCheckoutMin() {
    const checkin = new Date(checkinInput.value);
    const minCheckout = new Date(checkin);
    minCheckout.setDate(minCheckout.getDate() + 1);
    checkoutInput.min = toISO(minCheckout);
    if (checkoutInput.value <= checkinInput.value) {
      checkoutInput.value = toISO(minCheckout);
    }
  }

  function nightsBetween() {
    const inD = new Date(checkinInput.value);
    const outD = new Date(checkoutInput.value);
    const diff = Math.round((outD - inD) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  function updateSummary() {
    const room = getRoomById(roomSelect.value);
    if (!room) return;
    const nights = nightsBetween();
    const subtotal = room.price * nights;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    document.getElementById("summary-thumb").className = `summary-thumb ${room.theme}`;
    document.getElementById("summary-room-name").textContent = room.name;
    document.getElementById("summary-room-tagline").textContent = room.tagline;
    document.getElementById("sum-checkin").textContent = formatDate(checkinInput.value);
    document.getElementById("sum-checkout").textContent = formatDate(checkoutInput.value);
    document.getElementById("sum-guests").textContent = `${guestsSelect.value} Guest${Number(guestsSelect.value) > 1 ? "s" : ""}`;
    document.getElementById("sum-nights").textContent = nights;
    document.getElementById("sum-rate").textContent = `${formatCurrency(room.price)} / night`;
    document.getElementById("sum-subtotal").textContent = formatCurrency(subtotal);
    document.getElementById("sum-tax").textContent = formatCurrency(tax);
    document.getElementById("sum-total").textContent = formatCurrency(total);
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }

  roomSelect.addEventListener("change", () => {
    populateGuests();
    updateSummary();
  });
  guestsSelect.addEventListener("change", updateSummary);
  checkinInput.addEventListener("change", () => {
    syncCheckoutMin();
    updateSummary();
  });
  checkoutInput.addEventListener("change", updateSummary);

  populateGuests();
  syncCheckoutMin();
  updateSummary();

  // ---------- Validation ----------
  function setError(field, message) {
    const el = form.querySelector(`[data-error-for="${field}"]`);
    if (el) el.textContent = message || "";
  }

  function validate(data) {
    let valid = true;

    if (!data.room) { setError("room", "Please select a room."); valid = false; } else setError("room");

    if (!data.checkin) { setError("checkin", "Check-in date is required."); valid = false; }
    else setError("checkin");

    if (!data.checkout) { setError("checkout", "Check-out date is required."); valid = false; }
    else if (nightsBetween() <= 0) { setError("checkout", "Check-out must be after check-in."); valid = false; }
    else setError("checkout");

    const room = getRoomById(data.room);
    if (room && Number(data.guests) > room.capacity) {
      setError("guests", `This room fits up to ${room.capacity} guests.`);
      valid = false;
    } else setError("guests");

    if (!data.fullname || data.fullname.trim().length < 2) {
      setError("fullname", "Please enter your full name."); valid = false;
    } else setError("fullname");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email || "")) {
      setError("email", "Please enter a valid email address."); valid = false;
    } else setError("email");

    const phonePattern = /^[+\d][\d\s-]{6,}$/;
    if (!phonePattern.test(data.phone || "")) {
      setError("phone", "Please enter a valid phone number."); valid = false;
    } else setError("phone");

    return valid;
  }

  function generateReference() {
    const stamp = Date.now().toString(36).toUpperCase().slice(-6);
    return `AH-${stamp}`;
  }

  function saveBooking(booking) {
    const existing = JSON.parse(localStorage.getItem("alloyBookings") || "[]");
    existing.push(booking);
    localStorage.setItem("alloyBookings", JSON.stringify(existing));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    if (!validate(formData)) return;

    const room = getRoomById(formData.room);
    const nights = nightsBetween();
    const subtotal = room.price * nights;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    const reference = generateReference();

    saveBooking({
      reference,
      roomId: room.id,
      roomName: room.name,
      checkin: formData.checkin,
      checkout: formData.checkout,
      guests: formData.guests,
      fullname: formData.fullname,
      email: formData.email,
      phone: formData.phone,
      requests: formData.requests || "",
      total: total.toFixed(2),
      bookedAt: new Date().toISOString(),
    });

    document.getElementById("conf-ref").textContent = reference;
    document.getElementById("conf-details").innerHTML = `
      <div class="summary-row"><span>Room</span><strong>${room.name}</strong></div>
      <div class="summary-row"><span>Guest</span><strong>${formData.fullname}</strong></div>
      <div class="summary-row"><span>Check-in</span><strong>${formatDate(formData.checkin)}</strong></div>
      <div class="summary-row"><span>Check-out</span><strong>${formatDate(formData.checkout)}</strong></div>
      <div class="summary-row"><span>Guests</span><strong>${formData.guests}</strong></div>
      <div class="summary-row total"><span>Total Paid at Check-in</span><strong>${formatCurrency(total)}</strong></div>
    `;

    document.getElementById("form-card").classList.add("hidden");
    document.getElementById("summary-card").classList.add("hidden");
    document.getElementById("confirmation-card").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("book-another").addEventListener("click", () => {
    window.location.href = "booking";
  });
})();
