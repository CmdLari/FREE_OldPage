const toggle = document.querySelector(".games-toggle");
const box = document.getElementById("gamesBox");

toggle.addEventListener("click", (e) => {
  e.preventDefault();

  box.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(box.classList.contains("open")));
});
