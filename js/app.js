import { addOrder, addReservation, listenOrderById } from "./firebase-config.js";

const STORAGE = {
  cart: "restaurant_cart_v1",
  lastOrderId: "restaurant_last_order_id",
  recentOrderIds: "restaurant_recent_order_ids"
};

const i18n = {
  es: {
    navMenu: "Menu",
    navOrder: "Pedido",
    navReservations: "Reservas",
    navAbout: "Nosotros",
    heroEyebrow: "Experiencia gastronomica premium",
    heroTitle: "Pide facil, reserva rapido y disfruta comida memorable",
    heroSub: "Sitio bilingue optimizado para movil y computador. Todo en un flujo de pedido claro y rapido.",
    heroCtaMenu: "Ver menu",
    heroCtaReservation: "Reservar mesa",
    heroCardTitle: "Horario",
    daysWeek: "Lunes a Viernes",
    daysWeekend: "Sabado y Domingo",
    badgeFast: "Servicio rapido",
    badgeFresh: "Producto fresco",
    badgeFamily: "Ambiente familiar",
    strip1Title: "Chef especializado",
    strip1Text: "Tecnica moderna con sabor casero.",
    strip2Title: "Ingredientes locales",
    strip2Text: "Calidad controlada todos los dias.",
    strip3Title: "Pedido intuitivo",
    strip3Text: "Ordena en segundos desde cualquier dispositivo.",
    menuTitle: "Menu por categorias",
    menuText: "Categorias formales: Entradas, Platos principales, Bebidas y Postres.",
    tabAll: "Todo",
    tabAppetizers: "Entradas",
    tabMain: "Platos principales",
    tabBeverages: "Bebidas",
    tabDesserts: "Postres",
    orderTitle: "Pedido rapido",
    orderText: "Agrega productos al carrito y envia el pedido a cocina con un clic.",
    reservationTitle: "Reserva de mesa",
    reservationText: "Comparte datos importantes para organizar tu experiencia.",
    fieldName: "Nombre completo",
    fieldPhone: "Telefono",
    fieldEmail: "Correo",
    fieldDate: "Fecha",
    fieldTime: "Hora",
    fieldParty: "Personas",
    fieldOccasion: "Ocasion",
    fieldAllergies: "Alergias",
    fieldNotes: "Notas especiales",
    btnReserve: "Enviar reserva",
    about1Title: "Atencion profesional",
    about1Text: "Equipo entrenado para tiempos de respuesta rapidos.",
    about2Title: "Calidad constante",
    about2Text: "Control interno en cocina y servicio al cliente.",
    about3Title: "Experiencia memorable",
    about3Text: "Diseno visual, sabor y confort en equilibrio.",
    cartTitle: "Carrito",
    cartTotal: "Total",
    orderCustomerName: "Nombre para el pedido",
    orderCustomerPhone: "Telefono de contacto",
    btnSendKitchen: "Enviar a cocina",
    btnClear: "Vaciar",
    footerText: "Direccion, telefono y horarios actualizados.",
    add: "Agregar",
    remove: "Eliminar",
    emptyCart: "Tu carrito esta vacio.",
    addedToCart: "agregado al carrito",
    orderSent: "Pedido enviado a cocina",
    reservationSent: "Reserva enviada",
    needCustomer: "Completa nombre y telefono del pedido.",
    trackerEmpty: "No hay pedidos recientes.",
    trackerLabel: "Ultimo pedido",
    status_pending: "Pendiente",
    status_in_progress: "En preparacion",
    status_accepted: "Aceptado",
    status_rejected: "Rechazado",
    orderError: "No se pudo enviar el pedido. Intenta de nuevo.",
    reservationError: "No se pudo enviar la reserva. Intenta de nuevo.",
    hnTimeLabel: "Hora en Honduras",
    hnWeatherLabel: "Clima en El Progreso",
    hnWeatherLoading: "Cargando clima...",
    hnWeatherError: "Clima no disponible"
  },
  en: {
    navMenu: "Menu",
    navOrder: "Order",
    navReservations: "Reservations",
    navAbout: "About",
    heroEyebrow: "Premium dining experience",
    heroTitle: "Order easily, reserve quickly, and enjoy memorable food",
    heroSub: "Bilingual website optimized for mobile and desktop with a fast order flow.",
    heroCtaMenu: "View menu",
    heroCtaReservation: "Reserve table",
    heroCardTitle: "Hours",
    daysWeek: "Monday to Friday",
    daysWeekend: "Saturday and Sunday",
    badgeFast: "Fast service",
    badgeFresh: "Fresh products",
    badgeFamily: "Family friendly",
    strip1Title: "Specialized chef",
    strip1Text: "Modern technique with home flavor.",
    strip2Title: "Local ingredients",
    strip2Text: "Quality controlled every day.",
    strip3Title: "Intuitive ordering",
    strip3Text: "Order in seconds from any device.",
    menuTitle: "Menu by category",
    menuText: "Formal categories: Appetizers, Main Courses, Beverages, and Desserts.",
    tabAll: "All",
    tabAppetizers: "Appetizers",
    tabMain: "Main Courses",
    tabBeverages: "Beverages",
    tabDesserts: "Desserts",
    orderTitle: "Quick order",
    orderText: "Add products to cart and send to kitchen in one click.",
    reservationTitle: "Table reservation",
    reservationText: "Share important details so we can prepare your visit.",
    fieldName: "Full name",
    fieldPhone: "Phone",
    fieldEmail: "Email",
    fieldDate: "Date",
    fieldTime: "Time",
    fieldParty: "Guests",
    fieldOccasion: "Occasion",
    fieldAllergies: "Allergies",
    fieldNotes: "Special notes",
    btnReserve: "Send reservation",
    about1Title: "Professional service",
    about1Text: "Team trained for fast response times.",
    about2Title: "Consistent quality",
    about2Text: "Internal controls in kitchen and customer service.",
    about3Title: "Memorable experience",
    about3Text: "Visual design, flavor and comfort in balance.",
    cartTitle: "Cart",
    cartTotal: "Total",
    orderCustomerName: "Order name",
    orderCustomerPhone: "Contact phone",
    btnSendKitchen: "Send to kitchen",
    btnClear: "Clear",
    footerText: "Address, phone and opening hours up to date.",
    add: "Add",
    remove: "Remove",
    emptyCart: "Your cart is empty.",
    addedToCart: "added to cart",
    orderSent: "Order sent to kitchen",
    reservationSent: "Reservation sent",
    needCustomer: "Please complete order name and phone.",
    trackerEmpty: "No recent orders.",
    trackerLabel: "Last order",
    status_pending: "Pending",
    status_in_progress: "In preparation",
    status_accepted: "Accepted",
    status_rejected: "Rejected",
    orderError: "Could not send order. Please try again.",
    reservationError: "Could not send reservation. Please try again.",
    hnTimeLabel: "Honduras time",
    hnWeatherLabel: "Weather in El Progreso",
    hnWeatherLoading: "Loading weather...",
    hnWeatherError: "Weather unavailable"
  }
};

// Optional per-item image:
// Add `image: "assets/menu/your-photo.jpg"` inside any item below.
// Example:
// { id: "a1", ..., price: 8.5, image: "assets/menu/bruschetta.jpg" }
const menuItems = [
  { id: "a1", category: "appetizers", title: { es: "Bruschetta clasica", en: "Classic bruschetta" }, price: 8.5, image: "assets/bruschetta-clasica.jpg" },
  { id: "a2", category: "appetizers", title: { es: "Ceviche de pescado", en: "Fish ceviche" }, price: 11.5, image: "assets/ceviche-de-pescado.webp" },
  { id: "a3", category: "appetizers", title: { es: "Carpaccio de res", en: "Beef carpaccio" }, price: 12.0, image: "assets/carpaccio-de-res.webp" },
  { id: "a4", category: "appetizers", title: { es: "Croquetas de queso", en: "Cheese croquettes" }, price: 7.5, image: "assets/croquetas-de-queso.jpg" },
  { id: "a5", category: "appetizers", title: { es: "Empanadas gourmet", en: "Gourmet empanadas" }, price: 8.0, image: "assets/empanada-gourmet.webp" },
  { id: "a6", category: "appetizers", title: { es: "Tartar de atun", en: "Tuna tartare" }, price: 13.0, image: "assets/tartar-de-atun.jpg" },
  { id: "a7", category: "appetizers", title: { es: "Ensalada mediterranea", en: "Mediterranean salad" }, price: 9.0, image: "assets/ensalada-mediterranea.jpg" },
  { id: "a8", category: "appetizers", title: { es: "Sopa de temporada", en: "Seasonal soup" }, price: 7.0, image: "assets/sopa-de-temporada.jpg" },
  { id: "a9", category: "appetizers", title: { es: "Tabla de quesos", en: "Cheese board" }, price: 14.0, image: "assets/tabla-de-quesos.jpg" },
  { id: "a10", category: "appetizers", title: { es: "Pulpo a la plancha", en: "Grilled octopus" }, price: 15.0, image: "assets/pulpo-a-la-plancha.jpg" },
  { id: "m1", category: "main_courses", title: { es: "Ribeye a la parrilla", en: "Grilled ribeye" }, price: 28.0, image: "assets/ribeye-a-la-parrilla.jpg" },
  { id: "m2", category: "main_courses", title: { es: "Salmon glaseado", en: "Glazed salmon" }, price: 23.0, image: "assets/salmon-glaseado.jpg" },
  { id: "m3", category: "main_courses", title: { es: "Pasta trufada", en: "Truffle pasta" }, price: 19.0, image: "assets/pasta-trufada.jpeg" },
  { id: "m4", category: "main_courses", title: { es: "Pollo rostizado", en: "Roasted chicken" }, price: 18.0, image: "assets/pollo-rostizado.jpg" },
  { id: "m5", category: "main_courses", title: { es: "Paella de mariscos", en: "Seafood paella" }, price: 27.0, image: "assets/paella-de-mariscos.jpg" },
  { id: "m6", category: "main_courses", title: { es: "Lasagna artesanal", en: "Artisan lasagna" }, price: 16.0, image: "assets/lasagna-artesanal.jpg" },
  { id: "m7", category: "main_courses", title: { es: "Hamburguesa premium", en: "Premium burger" }, price: 15.0, image: "assets/hamburguesa-premium.jpg" },
  { id: "m8", category: "main_courses", title: { es: "Lomo en salsa", en: "Tenderloin in sauce" }, price: 24.0, image: "assets/lomo-en-salsa.jpg" },
  { id: "m9", category: "main_courses", title: { es: "Arroz meloso", en: "Creamy rice" }, price: 20.0, image: "assets/arroz-meloso.jpg" },
  { id: "m10", category: "main_courses", title: { es: "Costillas BBQ", en: "BBQ ribs" }, price: 22.0, image: "assets/costillas-bbq.jpg" },
  { id: "b1", category: "beverages", title: { es: "Agua mineral", en: "Mineral water" }, price: 2.5, image: "assets/agua-mineral.jpg" },
  { id: "b2", category: "beverages", title: { es: "Limonada natural", en: "Fresh lemonade" }, price: 4.0, image: "assets/limonada-natural.webp" },
  { id: "b3", category: "beverages", title: { es: "Jugo verde", en: "Green juice" }, price: 5.0, image: "assets/jugo-verde.jpeg" },
  { id: "b4", category: "beverages", title: { es: "Cafe espresso", en: "Espresso" }, price: 3.0, image: "assets/cafe-espresso.webp" },
  { id: "b5", category: "beverages", title: { es: "Te herbal", en: "Herbal tea" }, price: 3.5, image: "assets/te-herbal.jpg" },
  { id: "b6", category: "beverages", title: { es: "Cerveza artesanal", en: "Craft beer" }, price: 6.0, image: "assets/cerveza-artesanal.jpg" },
  { id: "b7", category: "beverages", title: { es: "Vino tinto copa", en: "Red wine glass" }, price: 8.0, image: "assets/vino-tinto-copa.jpg" },
  { id: "b8", category: "beverages", title: { es: "Vino blanco copa", en: "White wine glass" }, price: 8.0, image: "assets/vino-blanco-copa.jpg" },
  { id: "b9", category: "beverages", title: { es: "Coctel de autor", en: "Signature cocktail" }, price: 10.0, image: "assets/coctel-de-autor.jpg" },
  { id: "b10", category: "beverages", title: { es: "Mocktail tropical", en: "Tropical mocktail" }, price: 7.0, image: "assets/mocktail-tropical.jpg" },
  { id: "d1", category: "desserts", title: { es: "Tiramisu", en: "Tiramisu" }, price: 7.5, image: "assets/tiramisu.jpg" },
  { id: "d2", category: "desserts", title: { es: "Cheesecake", en: "Cheesecake" }, price: 7.0, image: "assets/cheesecake.jpg" },
  { id: "d3", category: "desserts", title: { es: "Brownie caliente", en: "Warm brownie" }, price: 6.5, image: "assets/brownie-caliente.jpg" },
  { id: "d4", category: "desserts", title: { es: "Helado artesanal", en: "Artisan ice cream" }, price: 5.0, image: "assets/helado-artesanal.jpg" },
  { id: "d5", category: "desserts", title: { es: "Flan casero", en: "Homemade flan" }, price: 5.5, image: "assets/flan-casero.jpg" },
  { id: "d6", category: "desserts", title: { es: "Pie de limon", en: "Lemon pie" }, price: 6.0, image: "assets/pie-de-limon.jpg" },
  { id: "d7", category: "desserts", title: { es: "Creme brulee", en: "Creme brulee" }, price: 7.0, image: "assets/creme-brulee.jpg" },
  { id: "d8", category: "desserts", title: { es: "Mousse de chocolate", en: "Chocolate mousse" }, price: 6.5, image: "assets/mousse-de-chocolate.jpg" },
  { id: "d9", category: "desserts", title: { es: "Fruta fresca", en: "Fresh fruit" }, price: 5.0, image: "assets/fruta-fresca.webp" },
  { id: "d10", category: "desserts", title: { es: "Coulant de cacao", en: "Chocolate coulant" }, price: 8.0, image: "assets/coulant-de-cacao.jpg" }
];
const categoryImageMap = {
  appetizers: "assets/entradas.svg",
  main_courses: "assets/principales.svg",
  beverages: "assets/bebidas.svg",
  desserts: "assets/postres.svg"
};
const menuGrid = document.getElementById("menuGrid");
const tabs = Array.from(document.querySelectorAll(".chip[data-category]"));
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("cartDrawer");
const cartItemsEl = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const sendToKitchenBtn = document.getElementById("sendToKitchen");
const toast = document.getElementById("toast");
const tracker = document.getElementById("orderTracker");
const reservationForm = document.getElementById("reservationForm");
const langToggle = document.getElementById("langToggle");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
const hnTimeValue = document.getElementById("hnTimeValue");
const hnWeatherValue = document.getElementById("hnWeatherValue");

let lang = "es";
let activeCategory = "all";
let cart = read(STORAGE.cart, []);
let recentOrderIds = [];
const trackerOrderById = new Map();
const trackerUnsubs = new Map();
const trackerClearTimers = new Map();
let toastTimer = null;
let hnTimeTick = null;
let hnWeatherTick = null;
let weatherState = { loading: true, error: false, temperature: null, weatherCode: null };

const HONDURAS_TIMEZONE = "America/Tegucigalpa";
const WEATHER_ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude=15.4012&longitude=-87.8000&current=temperature_2m,weather_code&timezone=America%2FTegucigalpa";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_e) {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function t(key) {
  return (i18n[lang] && i18n[lang][key]) || key;
}

function money(v) {
  return new Intl.NumberFormat(lang === "es" ? "es-HN" : "en-US", {
    style: "currency",
    currency: "HNL",
    minimumFractionDigits: 2
  }).format(Number(v || 0));
}

function renderHondurasTime() {
  if (!hnTimeValue) return;
  const formatter = new Intl.DateTimeFormat(lang === "es" ? "es-HN" : "en-US", {
    timeZone: HONDURAS_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  hnTimeValue.textContent = formatter.format(new Date());
}

function weatherLabelFromCode(code) {
  const labels = lang === "es"
    ? {
        0: "Despejado",
        1: "Mayormente despejado",
        2: "Parcialmente nublado",
        3: "Nublado",
        45: "Neblina",
        48: "Neblina escarchada",
        51: "Llovizna ligera",
        53: "Llovizna moderada",
        55: "Llovizna intensa",
        61: "Lluvia ligera",
        63: "Lluvia moderada",
        65: "Lluvia intensa",
        71: "Nieve ligera",
        73: "Nieve moderada",
        75: "Nieve intensa",
        80: "Chubascos ligeros",
        81: "Chubascos moderados",
        82: "Chubascos intensos",
        95: "Tormenta",
        96: "Tormenta con granizo",
        99: "Tormenta fuerte con granizo"
      }
    : {
        0: "Clear sky",
        1: "Mostly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Light showers",
        81: "Moderate showers",
        82: "Violent showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Severe thunderstorm with hail"
      };

  return labels[Number(code)] || (lang === "es" ? "Condicion variable" : "Variable conditions");
}

function renderHondurasWeather() {
  if (!hnWeatherValue) return;
  if (weatherState.loading) {
    hnWeatherValue.textContent = t("hnWeatherLoading");
    return;
  }
  if (weatherState.error || weatherState.temperature === null) {
    hnWeatherValue.textContent = t("hnWeatherError");
    return;
  }
  const roundedTemp = Math.round(Number(weatherState.temperature));
  hnWeatherValue.textContent = `${roundedTemp}°C | ${weatherLabelFromCode(weatherState.weatherCode)}`;
}

async function fetchHondurasWeather() {
  weatherState.loading = true;
  weatherState.error = false;
  renderHondurasWeather();
  try {
    const response = await fetch(WEATHER_ENDPOINT, { cache: "no-store" });
    if (!response.ok) throw new Error("weather_fetch_failed");
    const data = await response.json();
    weatherState = {
      loading: false,
      error: false,
      temperature: data?.current?.temperature_2m ?? null,
      weatherCode: data?.current?.weather_code ?? null
    };
  } catch (_e) {
    weatherState = { ...weatherState, loading: false, error: true };
  }
  renderHondurasWeather();
}

function startHondurasLiveInfo() {
  if (!hnTimeValue && !hnWeatherValue) return;
  renderHondurasTime();
  renderHondurasWeather();
  if (hnTimeTick) clearInterval(hnTimeTick);
  hnTimeTick = setInterval(renderHondurasTime, 1000);
  fetchHondurasWeather();
  if (hnWeatherTick) clearInterval(hnWeatherTick);
  hnWeatherTick = setInterval(fetchHondurasWeather, 10 * 60 * 1000);
}

function showToast(message, options = {}) {
  const { duration = 1700, center = false, highlight = false } = options;
  toast.textContent = message;
  toast.classList.remove("center", "highlight");
  if (center) toast.classList.add("center");
  if (highlight) toast.classList.add("highlight");
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show", "center", "highlight");
  }, duration);
}

function statusLabel(status) {
  return t(`status_${status}`) || status;
}

function applyI18n() {
  document.documentElement.lang = lang;
  langToggle.textContent = lang === "es" ? "EN" : "ES";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  renderMenu();
  renderCart();
  renderTracker();
  renderHondurasTime();
  renderHondurasWeather();
}

function filteredMenu() {
  return menuItems.filter((item) => (activeCategory === "all" ? true : item.category === activeCategory));
}

function categoryLabel(category) {
  return String(category || "").replace(/_/g, " ");
}

function itemImage(item) {
  return item.image || categoryImageMap[item.category] || "assets/food.svg";
}

function renderMenu() {
  const items = filteredMenu();
  menuGrid.innerHTML = items
    .map((item) => `
      <article class="menu-card">
        <figure class="menu-photo-wrap">
          <img class="menu-photo" src="${itemImage(item)}" alt="${item.title[lang]}" loading="lazy" onerror="this.onerror=null;this.src='assets/postres.svg';">
        </figure>
        <h3>${item.title[lang]}</h3>
        <p class="menu-category">${categoryLabel(item.category)}</p>
        <div class="meta">
          <span class="price">${money(item.price)}</span>
          <button class="btn btn-primary add-item" data-id="${item.id}">${t("add")}</button>
        </div>
      </article>
    `)
    .join("");
}

function openDrawer() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.classList.remove("hidden");
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
}

function animateAddToCart(sourceEl, message) {
  if (!sourceEl || !cartBtn) return;

  const start = sourceEl.getBoundingClientRect();
  const end = cartBtn.getBoundingClientRect();
  const badge = document.createElement("div");
  badge.className = "cart-fly-note";
  badge.textContent = message;
  badge.style.left = `${start.left + start.width / 2}px`;
  badge.style.top = `${start.top + start.height / 2}px`;
  document.body.appendChild(badge);

  requestAnimationFrame(() => {
    const dx = end.left + end.width / 2 - (start.left + start.width / 2);
    const dy = end.top + end.height / 2 - (start.top + start.height / 2);
    badge.style.transform = `translate(${dx}px, ${dy}px) scale(0.75)`;
    badge.style.opacity = "0";
  });

  cartBtn.classList.add("bump");
  setTimeout(() => cartBtn.classList.remove("bump"), 430);
  setTimeout(() => badge.remove(), 520);
}

function showCenterNotice(message) {
  showToast(message, { duration: 2200, center: true, highlight: true });
}

function readRecentOrderIds() {
  const saved = read(STORAGE.recentOrderIds, []);
  if (!Array.isArray(saved)) return [];
  return Array.from(new Set(saved.filter((id) => typeof id === "string" && id.trim())));
}

function writeRecentOrderIds(ids) {
  recentOrderIds = Array.from(new Set(ids.filter((id) => typeof id === "string" && id.trim())));
  write(STORAGE.recentOrderIds, recentOrderIds);
}

function clearTrackerTimer(orderId) {
  const timer = trackerClearTimers.get(orderId);
  if (!timer) return;
  clearTimeout(timer);
  trackerClearTimers.delete(orderId);
}

function unsubscribeTrackerOrder(orderId) {
  clearTrackerTimer(orderId);
  const unsub = trackerUnsubs.get(orderId);
  if (typeof unsub === "function") unsub();
  trackerUnsubs.delete(orderId);
  trackerOrderById.delete(orderId);
}

function removeRecentOrderId(orderId) {
  unsubscribeTrackerOrder(orderId);
  writeRecentOrderIds(recentOrderIds.filter((id) => id !== orderId));
  if (!recentOrderIds.length) localStorage.removeItem(STORAGE.lastOrderId);
  renderTracker();
}

function asDate(value) {
  if (!value) return null;
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function scheduleAcceptedTrackerClear(order) {
  if (!order || !order.id) return;
  const orderId = order.id;
  clearTrackerTimer(orderId);
  const isTerminalStatus = order && (order.status === "accepted" || order.status === "rejected");
  if (!isTerminalStatus) return;

  const resolvedAt = asDate(order.updatedAt) || asDate(order.createdAt);
  if (!resolvedAt) return;

  const hideAt = resolvedAt.getTime() + 3 * 60 * 1000;
  const waitMs = hideAt - Date.now();
  if (waitMs <= 0) {
    removeRecentOrderId(orderId);
    return;
  }
  const timer = setTimeout(() => {
    removeRecentOrderId(orderId);
  }, waitMs);
  trackerClearTimers.set(orderId, timer);
}

function addToCart(id, sourceEl) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;
  const row = cart.find((c) => c.id === id);
  if (row) row.qty += 1;
  else cart.push({ id: item.id, title: item.title, price: item.price, qty: 1, image: item.image, category: item.category });
  write(STORAGE.cart, cart);
  renderCart();
  const message = `${item.title[lang]} ${t("addedToCart")}`;
  showToast(message, { highlight: true, duration: 1500 });
  animateAddToCart(sourceEl, message);
}

function updateQty(id, delta) {
  const row = cart.find((c) => c.id === id);
  if (!row) return;
  row.qty += delta;
  if (row.qty <= 0) cart = cart.filter((c) => c.id !== id);
  write(STORAGE.cart, cart);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, row) => sum + row.qty, 0);
  const total = cart.reduce((sum, row) => sum + row.qty * row.price, 0);
  cartCount.textContent = String(count);
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItemsEl.innerHTML = `<p>${t("emptyCart")}</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (row) => `
      <div class="cart-row">
        <div class="cart-row-main">
          <img class="cart-thumb" src="${cartImage(row)}" alt="${row.title[lang]}" loading="lazy" onerror="this.onerror=null;this.src='assets/food.svg';">
          <div class="cart-row-text">
            <h4>${row.title[lang]}</h4>
            <p>${money(row.price)} x ${row.qty}</p>
          </div>
        </div>
        <div class="qty-line">
          <button class="btn btn-outline qty" data-id="${row.id}" data-delta="-1">-</button>
          <button class="btn btn-outline qty" data-id="${row.id}" data-delta="1">+</button>
          <button class="btn btn-ghost remove" data-id="${row.id}">${t("remove")}</button>
        </div>
      </div>
    `
    )
    .join("");
}

function cartImage(row) {
  if (row.image) return row.image;
  const source = menuItems.find((item) => item.id === row.id);
  if (source) return itemImage(source);
  return "assets/food.svg";
}

function renderTracker() {
  const orders = recentOrderIds
    .map((id) => trackerOrderById.get(id))
    .filter((order) => Boolean(order))
    .sort((a, b) => {
      const aDate = asDate(a.createdAt);
      const bDate = asDate(b.createdAt);
      return (bDate ? bDate.getTime() : 0) - (aDate ? aDate.getTime() : 0);
    });

  if (!orders.length) {
    tracker.innerHTML = `<p>${t("trackerEmpty")}</p>`;
    return;
  }
  tracker.innerHTML = orders
    .map((order) => {
      const createdAt = asDate(order.createdAt) || new Date();
      return `
        <div class="tracker-row">
          <strong>${t("trackerLabel")}: #${order.displayId || order.id.slice(0, 6)}</strong>
          <p>${order.customer?.name || ""} | ${createdAt.toLocaleString(lang === "es" ? "es-ES" : "en-US")}</p>
          <p><strong>${statusLabel(order.status)}</strong></p>
        </div>
      `;
    })
    .join("");
}

function subscribeTrackerOrder(orderId) {
  if (!orderId || trackerUnsubs.has(orderId)) return;
  const unsub = listenOrderById(
    orderId,
    (order) => {
      if (!order) {
        removeRecentOrderId(orderId);
        return;
      }
      trackerOrderById.set(orderId, order);
      scheduleAcceptedTrackerClear(order);
      renderTracker();
    },
    () => {
      trackerOrderById.delete(orderId);
      renderTracker();
    }
  );
  trackerUnsubs.set(orderId, unsub);
}

function syncTrackerSubscriptions() {
  const active = new Set(recentOrderIds);
  Array.from(trackerUnsubs.keys()).forEach((id) => {
    if (!active.has(id)) unsubscribeTrackerOrder(id);
  });
  recentOrderIds.forEach((id) => subscribeTrackerOrder(id));
}

function addRecentOrderId(orderId) {
  if (!orderId) return;
  const next = [orderId, ...recentOrderIds.filter((id) => id !== orderId)].slice(0, 5);
  writeRecentOrderIds(next);
  localStorage.setItem(STORAGE.lastOrderId, orderId);
  syncTrackerSubscriptions();
}

async function submitOrder() {
  if (!cart.length) return;
  const customerName = (document.getElementById("orderCustomerName").value || "").trim();
  const customerPhone = (document.getElementById("orderCustomerPhone").value || "").trim();
  if (!customerName || !customerPhone) {
    showToast(t("needCustomer"));
    return;
  }

  const orderPayload = {
    language: lang,
    customer: { name: customerName, phone: customerPhone },
    items: cart,
    total: cart.reduce((sum, row) => sum + row.qty * row.price, 0)
  };

  try {
    const orderId = await addOrder(orderPayload);
    addRecentOrderId(orderId);
    cart = [];
    write(STORAGE.cart, cart);
    renderCart();
    closeDrawer();
    showCenterNotice(t("orderSent"));
  } catch (_e) {
    showToast(t("orderError"));
  }
}

async function submitReservation(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(reservationForm).entries());
  if (!data.name || !data.phone || !data.date || !data.time || !data.party) {
    reservationForm.reportValidity();
    return;
  }

  try {
    await addReservation({ ...data, language: lang });
    showToast(t("reservationSent"));
    reservationForm.reset();
  } catch (_e) {
    showToast(t("reservationError"));
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((node) => node.classList.remove("active"));
    tab.classList.add("active");
    activeCategory = tab.dataset.category;
    renderMenu();
  });
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-item");
  if (button) addToCart(button.dataset.id, button);
});

cartItemsEl.addEventListener("click", (event) => {
  const qty = event.target.closest(".qty");
  if (qty) {
    updateQty(qty.dataset.id, Number(qty.dataset.delta));
    return;
  }
  const removeBtn = event.target.closest(".remove");
  if (removeBtn) {
    cart = cart.filter((row) => row.id !== removeBtn.dataset.id);
    write(STORAGE.cart, cart);
    renderCart();
  }
});

langToggle.addEventListener("click", () => {
  lang = lang === "es" ? "en" : "es";
  applyI18n();
});

if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("pointerdown", (event) => {
    const isOpen = primaryNav.classList.contains("open");
    if (!isOpen) return;
    const clickedInsideMenu = event.target.closest("#primaryNav");
    const clickedToggle = event.target.closest("#navToggle");
    if (clickedInsideMenu || clickedToggle) return;
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
}

cartBtn.addEventListener("click", openDrawer);
closeCart.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
clearCart.addEventListener("click", () => {
  cart = [];
  write(STORAGE.cart, cart);
  renderCart();
});
sendToKitchenBtn.addEventListener("click", submitOrder);
reservationForm.addEventListener("submit", submitReservation);

recentOrderIds = readRecentOrderIds();
if (!recentOrderIds.length) {
  const existingLastOrderId = localStorage.getItem(STORAGE.lastOrderId);
  if (existingLastOrderId) {
    recentOrderIds = [existingLastOrderId];
    writeRecentOrderIds(recentOrderIds);
  }
}
syncTrackerSubscriptions();
applyI18n();
startHondurasLiveInfo();
