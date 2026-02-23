const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

const contactForm = document.querySelector("#contact-form");
const statusText = document.querySelector(".form-status");
const orderForm = document.querySelector("#order-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (statusText) {
      statusText.textContent = "Gracias por tu mensaje. Te contactaremos pronto.";
    }
    contactForm.reset();
  });
}

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(orderForm);
    const nombre = data.get("nombre");
    const telefono = data.get("telefono");
    const producto = data.get("producto");
    const mensaje = data.get("mensaje");
    const texto = `Hola Emerald Trade, soy ${nombre}. Mi teléfono es ${telefono}. Me interesa: ${producto}. Detalles: ${mensaje}`;
    const url = `https://wa.me/573028152276?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
    const orderStatus = orderForm.querySelector(".form-status");
    if (orderStatus) {
      orderStatus.textContent = "Pedido enviado. Te responderemos por WhatsApp.";
    }
    orderForm.reset();
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

const catalogItems = [
  { type: "pulsera", name: "Pulsera Esmeralda Viva", price: "$1.450.000 COP" },
  { type: "pulsera", name: "Pulsera Aura Dorada", price: "$1.980.000 COP" },
  { type: "anillo", name: "Anillo Reino Verde", price: "$2.850.000 COP" },
  { type: "anillo", name: "Anillo Aura Imperial", price: "$3.450.000 COP" },
  { type: "collar", name: "Collar Niebla Dorada", price: "$2.750.000 COP" },
  { type: "collar", name: "Collar Esencia Real", price: "$3.150.000 COP" },
  { type: "aretes", name: "Aretes Halo Esmeralda", price: "$1.150.000 COP" },
  { type: "aretes", name: "Aretes Aurora Dorada", price: "$1.420.000 COP" }
];

const catalogContainer = document.querySelector("#dynamic-catalog");
const catalogFilters = document.querySelectorAll(".catalog-filter");

function renderCatalog(filter) {
  if (!catalogContainer) return;
  catalogContainer.innerHTML = "";
  const items = filter && filter !== "all" ? catalogItems.filter(item => item.type === filter) : catalogItems;
  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image placeholder">Foto</div>
      <div class="product-info">
        <span class="product-type">${item.type}</span>
        <h3>${item.name}</h3>
        <p class="product-price">${item.price}</p>
      </div>
    `;
    catalogContainer.appendChild(card);
  });
}

if (catalogContainer) {
  renderCatalog("all");
}

catalogFilters.forEach(button => {
  button.addEventListener("click", () => {
    catalogFilters.forEach(filterBtn => filterBtn.classList.remove("active"));
    button.classList.add("active");
    renderCatalog(button.dataset.filter);
  });
});

const kilaticoBubble = document.querySelector(".kilatico-bubble");
const kilaticoPanel = document.querySelector(".kilatico-panel");
const kilaticoLangButtons = document.querySelectorAll(".lang-btn");
const kilaticoBody = document.querySelector(".kilatico-body");
const kilaticoCTA = document.querySelector(".kilatico-cta");

async function fetchKilaticoMessage(lang, name, product) {
  if (!kilaticoBody) return;
  try {
    const response = await fetch("/api/kilatico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, name, product }),
    });
    const data = await response.json();
    kilaticoBody.innerHTML = `
      <div class=\"kilatico-message bot\">${data.greeting}</div>
      <div class=\"kilatico-message bot\">${data.message}</div>
      <div class=\"kilatico-message bot\">${data.cta}</div>
    `;
  } catch (error) {
    kilaticoBody.innerHTML = `<div class=\"kilatico-message bot\">Hola, soy Kilatico ✨ ¿Quieres verte exclusivo y elegante con algo único y artesanal?</div>`;
  }
}

function setKilaticoMessage(lang) {
  const name = document.querySelector("#kilatico-name")?.value || "";
  const product = document.querySelector("#kilatico-product")?.value || "pulseras";
  fetchKilaticoMessage(lang, name, product);
}

if (kilaticoBubble && kilaticoPanel) {
  kilaticoBubble.addEventListener("click", () => {
    const isHidden = kilaticoPanel.hasAttribute("hidden");
    if (isHidden) {
      kilaticoPanel.removeAttribute("hidden");
      const activeLang = document.querySelector(".lang-btn.active")?.dataset.lang || "es";
      setKilaticoMessage(activeLang);
    } else {
      kilaticoPanel.setAttribute("hidden", "");
    }
  });
}

kilaticoLangButtons.forEach(button => {
  button.addEventListener("click", () => {
    kilaticoLangButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    setKilaticoMessage(button.dataset.lang);
  });
});

if (kilaticoCTA) {
  kilaticoCTA.addEventListener("click", () => {
    const activeLang = document.querySelector(".lang-btn.active")?.dataset.lang || "es";
    const name = document.querySelector("#kilatico-name")?.value || "";
    const city = document.querySelector("#kilatico-city")?.value || "";
    const product = document.querySelector("#kilatico-product")?.value || "pulseras";
    const budget = document.querySelector("#kilatico-budget")?.value || "";
    const size = document.querySelector("#kilatico-size")?.value || "";
    const date = document.querySelector("#kilatico-date")?.value || "";
    const custom = document.querySelector("#kilatico-custom")?.value || "si";

    const texto = activeLang === "en"
      ? `Hi Emerald Trade, I'm ${name || "a client"}. I want an exclusive ${product}. City: ${city || "N/A"}. Budget: ${budget || "N/A"}. Size: ${size || "N/A"}. Special date: ${date || "N/A"}. Custom piece: ${custom === "si" ? "Yes" : "No"}. I want something elegant and handcrafted.`
      : `Hola Emerald Trade, soy ${name || "cliente"}. Quiero ${product} exclusivo. Ciudad: ${city || "N/A"}. Presupuesto: ${budget || "N/A"}. Talla: ${size || "N/A"}. Fecha especial: ${date || "N/A"}. Joya personalizada: ${custom === "si" ? "Sí" : "No"}. Quiero algo elegante y artesanal.`;

    window.open(`https://wa.me/573028152276?text=${encodeURIComponent(texto)}`, "_blank");
  });
}
