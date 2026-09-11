// Client-side validation + mock submit for the contact form (no backend).
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const success = document.getElementById("contact-success");

  function setError(field, message) {
    const el = form.querySelector(`[data-error-for="${field}"]`);
    if (el) el.textContent = message || "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;

    if (!data.name || data.name.trim().length < 2) {
      setError("name", "Please enter your name.");
      valid = false;
    } else setError("name");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email || "")) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    } else setError("email");

    if (!data.message || data.message.trim().length < 10) {
      setError("message", "Please include at least a short message (10+ characters).");
      valid = false;
    } else setError("message");

    if (!valid) {
      success.classList.add("hidden");
      return;
    }

    success.classList.remove("hidden");
    form.reset();
  });
});
