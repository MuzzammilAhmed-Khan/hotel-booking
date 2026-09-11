// Renders and filters the room grid on rooms.html
(function () {
  const grid = document.getElementById("room-grid");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const pills = document.querySelectorAll("#filter-pills .pill");
  const sortSelect = document.getElementById("sort-select");

  const params = new URLSearchParams(window.location.search);
  let activeType = params.get("type") || "";

  const defaults = defaultBookingDates();
  const searchCheckin = params.get("checkin") || defaults.checkin;
  const searchCheckout = params.get("checkout") || defaults.checkout;
  const searchGuests = params.get("guests") || 2;

  function roomCardHTML(room) {
    const waLink = buildWhatsAppLink(room, searchCheckin, searchCheckout, searchGuests);
    return `
      <div class="room-card">
        <div class="room-thumb ${room.theme}">
          <span class="badge">${room.type}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M5 9V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/></svg>
        </div>
        <div class="room-body">
          <h3>${room.name}</h3>
          <p class="room-tagline">${room.tagline}</p>
          <div class="room-meta">
            <span>👤 ${room.capacity} Guests</span>
            <span>📐 ${room.size} m²</span>
          </div>
          <p class="room-desc">${room.description}</p>
          <div class="amenity-tags">
            ${room.amenities.slice(0, 3).map((a) => `<span>${a}</span>`).join("")}
          </div>
          <div class="room-footer">
            <div class="room-price">${formatCurrency(room.price)}<small> / night</small></div>
            <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-dark btn-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.9 9.9 0 0 0 4.63 1.15h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.15c-.24.68-1.2 1.28-1.98 1.44-.53.11-1.22.2-3.55-.76-2.98-1.24-4.9-4.26-5.05-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.75-2.16 1.03-2.45.24-.25.63-.36 1.01-.36.12 0 .23 0 .33.01.29.01.43.03.62.48.24.58.81 2.03.88 2.18.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.71 1.18 1.53 1.91 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.17-.19.71-.82.9-1.11.19-.28.38-.23.63-.14.26.09 1.64.78 1.92.92.28.14.46.21.53.33.07.12.07.68-.17 1.36Z"/></svg>
              View &amp; Book
            </a>
          </div>
        </div>
      </div>`;
  }

  function render() {
    let rooms = ROOMS.filter((r) => !activeType || r.type === activeType);

    switch (sortSelect.value) {
      case "price-asc":
        rooms = rooms.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        rooms = rooms.slice().sort((a, b) => b.price - a.price);
        break;
      case "capacity":
        rooms = rooms.slice().sort((a, b) => b.capacity - a.capacity);
        break;
    }

    grid.innerHTML = rooms.map(roomCardHTML).join("");
    emptyState.classList.toggle("hidden", rooms.length > 0);
    resultCount.textContent = `Showing ${rooms.length} of ${ROOMS.length} rooms`;
  }

  pills.forEach((pill) => {
    if (pill.dataset.type === activeType) pill.classList.add("active");
    else pill.classList.remove("active");

    pill.addEventListener("click", () => {
      activeType = pill.dataset.type;
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      render();
    });
  });

  sortSelect.addEventListener("change", render);

  render();
})();
