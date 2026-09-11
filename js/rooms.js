// Renders and filters the room grid on rooms.html
(function () {
  const grid = document.getElementById("room-grid");
  const emptyState = document.getElementById("empty-state");
  const resultCount = document.getElementById("result-count");
  const pills = document.querySelectorAll("#filter-pills .pill");
  const sortSelect = document.getElementById("sort-select");

  const params = new URLSearchParams(window.location.search);
  let activeType = params.get("type") || "";

  function roomCardHTML(room) {
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
            <a href="booking?room=${room.id}" class="btn btn-dark btn-sm">View &amp; Book</a>
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
