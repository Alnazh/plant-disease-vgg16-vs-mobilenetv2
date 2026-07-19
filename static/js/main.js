const navToggle = document.getElementById("navbar-toggle");
const navLinks = document.getElementById("navbar-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}
