document.addEventListener("DOMContentLoaded", function () {

/* ========================================
 MOBILE SWIPE SUPPORT
======================================== */

const viewport = document.querySelector(".testimonial-viewport");

let startX = 0;
let endX = 0;

viewport.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

viewport.addEventListener("touchmove", (e) => {
  endX = e.touches[0].clientX;
});

viewport.addEventListener("touchend", () => {
  const diff = startX - endX;

  // minimum swipe distance
  if (Math.abs(diff) > 50) {
    stopAutoPlay();

    if (diff > 0) {
      nextSlide();   // swipe left → next
    } else {
      prevSlide();   // swipe right → prev
    }

    startAutoPlay();
  }
});

/* ========================================
   TESTIMONIAL CAROUSEL
======================================== */

let currentIndex = 0;
let cards;
let autoPlay;

function updateCarousel() {
  const track = document.getElementById("testimonial-track");
  const card = cards[currentIndex];

  const viewport = document.querySelector(".testimonial-viewport");

  const viewportWidth = viewport.offsetWidth;
  const cardWidth = card.offsetWidth;

  const cardLeft = card.offsetLeft;

  const centerOffset = cardLeft - (viewportWidth / 2) + (cardWidth / 2);

  track.style.transform = `translateX(-${centerOffset}px)`;

  cards.forEach(c => c.classList.remove("active"));
  card.classList.add("active");
}

function nextSlide() {
  if (currentIndex < cards.length - 3) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = cards.length - 3;
  }
  updateCarousel();
}

function startAutoPlay() {
  autoPlay = setInterval(nextSlide, 4000);
}

function stopAutoPlay() {
  clearInterval(autoPlay);
}

fetch("./feedback.json")
  .then(res => res.json())
  .then(data => {
    const track = document.getElementById("testimonial-track");

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "testimonial-card";
      card.innerHTML = `
        <div class="testimonial-name">${item.name}</div>
        <div class="testimonial-text">${item.feedback}</div>
      `;
      track.appendChild(card);
    });

    cards = document.querySelectorAll(".testimonial-card");

    updateCarousel();
    startAutoPlay();
  });

document.getElementById("next-btn").addEventListener("click", () => {
  stopAutoPlay();
  nextSlide();
  startAutoPlay();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  stopAutoPlay();
  prevSlide();
  startAutoPlay();
});
  /* ========================================
     SMOOTH SCROLL
  ======================================== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ========================================
     INTERSECTION OBSERVER
  ======================================== */

  const elements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(el => observer.observe(el));

});
