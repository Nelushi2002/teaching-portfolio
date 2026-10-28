/* =========================================================
   Small helpers for the portfolio:
   1. Phone menu button
   2. Reading progress bar + back-to-top button
   3. Home page slideshow
   4. Click-to-enlarge photos (lightbox)
   ========================================================= */

/* ---------- 1. Phone menu ---------- */
const siteNav = document.querySelector(".site-nav");
const menuBtn = document.querySelector(".menu-toggle");

if (siteNav && menuBtn) {
  menuBtn.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", isOpen);
  });
}

/* ---------- 2. Progress bar + back-to-top ---------- */
const progress = document.querySelector(".progress");

const toTop = document.createElement("button");
toTop.className = "to-top";
toTop.setAttribute("aria-label", "Back to top");
toTop.innerHTML = "&uarr;";
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.body.appendChild(toTop);

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  toTop.classList.toggle("show", window.scrollY > window.innerHeight);
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

/* ---------- 3. Slideshow ---------- */
const slideshow = document.querySelector(".slideshow");

if (slideshow) {
  const slides = slideshow.querySelectorAll(".slide");
  const dotsBox = slideshow.querySelector(".slide-dots");
  let current = 0;
  let timer;

  // create one dot per slide
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => { showSlide(i); start(); });
    dotsBox.appendChild(dot);
  });
  const dots = dotsBox.querySelectorAll("button");

  function showSlide(n) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 6000); // change every 6 seconds
  }
  function stop() { clearInterval(timer); }

  slideshow.querySelector(".prev").addEventListener("click", () => { showSlide(current - 1); start(); });
  slideshow.querySelector(".next").addEventListener("click", () => { showSlide(current + 1); start(); });

  // pause while the mouse is over the slideshow
  slideshow.addEventListener("mouseenter", stop);
  slideshow.addEventListener("mouseleave", start);

  showSlide(0);
  start();
}

/* ---------- 4. Lightbox ---------- */
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img alt="">';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector("img");

document.querySelectorAll(".content figure img, .photo-pair img, .gallery img, .testimonial img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  });
});

lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
document.addEventListener("keydown", e => {
  if (e.key === "Escape") lightbox.classList.remove("open");
});

/* ---------- 5. Blurred background for the lesson materials slideshow ----------
   Adds a soft, blurred copy of each photo behind it to fill the empty sides. */
document.querySelectorAll(".slideshow.fit .slide").forEach(slide => {
  const photo = slide.querySelector("img");
  if (!photo) return;
  const bg = photo.cloneNode();
  bg.className = "slide-bg";
  bg.alt = "";
  bg.setAttribute("aria-hidden", "true");
  slide.prepend(bg);
});