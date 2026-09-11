// Wires up the dark/light mode toggle button. The initial theme is applied
// synchronously by an inline <script> in <head> (before first paint) so
// there is no flash of the wrong theme; this file only handles the click.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const root = document.documentElement;

  const syncPressed = () => {
    toggle.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "dark"));
  };
  syncPressed();

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncPressed();
  });
});
