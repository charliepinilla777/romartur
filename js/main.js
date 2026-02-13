const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

const contactForm = document.querySelector("#contact-form");
const statusText = document.querySelector(".form-status");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (statusText) {
      statusText.textContent = "Gracias por tu mensaje. Te contactaremos pronto.";
    }
    contactForm.reset();
  });
}

// Carousel functionality
const slides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".indicator");
const prevBtn = document.querySelector(".carousel-prev");
const nextBtn = document.querySelector(".carousel-next");

let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  indicators.forEach(indicator => indicator.classList.remove("active"));
  
  if (index >= totalSlides) currentSlide = 0;
  else if (index < 0) currentSlide = totalSlides - 1;
  else currentSlide = index;
  
  slides[currentSlide].classList.add("active");
  indicators[currentSlide].classList.add("active");
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
}

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => showSlide(index));
});

// Auto-slide every 5 seconds
setInterval(() => {
  showSlide(currentSlide + 1);
}, 5000);
