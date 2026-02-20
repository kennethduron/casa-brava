import { addOrder, addReservation, listenOrderById } from "./firebase-config.js";

const STORAGE = {
  cart: "restaurant_cart_v1",
  lastOrderId: "restaurant_last_order_id"
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
    reservationError: "No se pudo enviar la reserva. Intenta de nuevo."
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
    reservationError: "Could not send reservation. Please try again."
  }
};

// Optional per-item image:
// Add `image: "assets/menu/your-photo.jpg"` inside any item below.
// Example:
// { id: "a1", ..., price: 8.5, image: "assets/menu/bruschetta.jpg" }
const menuItems = [
  { id: "a1", category: "appetizers", title: { es: "Bruschetta clasica", en: "Classic bruschetta" }, price: 8.5, image: "assets/bruschetta-clasica.jpg" },
  { id: "a2", category: "appetizers", title: { es: "Ceviche de pescado", en: "Fish ceviche" }, price: 11.5, image: "assets/ceviche-de-pescado.webp" }, 
  { id: "a3", category: "appetizers", title: { es: "Carpaccio de res", en: "Beef carpaccio" }, price: 12.0 },
  { id: "a4", category: "appetizers", title: { es: "Croquetas de queso", en: "Cheese croquettes" }, price: 7.5 },
  { id: "a5", category: "appetizers", title: { es: "Empanadas gourmet", en: "Gourmet empanadas" }, price: 8.0 },
  { id: "a6", category: "appetizers", title: { es: "Tartar de atun", en: "Tuna tartare" }, price: 13.0 },
  { id: "a7", category: "appetizers", title: { es: "Ensalada mediterranea", en: "Mediterranean salad" }, price: 9.0 },
  { id: "a8", category: "appetizers", title: { es: "Sopa de temporada", en: "Seasonal soup" }, price: 7.0 },
  { id: "a9", category: "appetizers", title: { es: "Tabla de quesos", en: "Cheese board" }, price: 14.0 },
  { id: "a10", category: "appetizers", title: { es: "Pulpo a la plancha", en: "Grilled octopus" }, price: 15.0 },
  { id: "m1", category: "main_courses", title: { es: "Ribeye a la parrilla", en: "Grilled ribeye" }, price: 28.0 },
  { id: "m2", category: "main_courses", title: { es: "Salmon glaseado", en: "Glazed salmon" }, price: 23.0 },
  { id: "m3", category: "main_courses", title: { es: "Pasta trufada", en: "Truffle pasta" }, price: 19.0 },
  { id: "m4", category: "main_courses", title: { es: "Pollo rostizado", en: "Roasted chicken" }, price: 18.0 },
  { id: "m5", category: "main_courses", title: { es: "Paella de mariscos", en: "Seafood paella" }, price: 27.0 },
  { id: "m6", category: "main_courses", title: { es: "Lasagna artesanal", en: "Artisan lasagna" }, price: 16.0 },
  { id: "m7", category: "main_courses", title: { es: "Hamburguesa premium", en: "Premium burger" }, price: 15.0 },
  { id: "m8", category: "main_courses", title: { es: "Lomo en salsa", en: "Tenderloin in sauce" }, price: 24.0 },
  { id: "m9", category: "main_courses", title: { es: "Arroz meloso", en: "Creamy rice" }, price: 20.0 },
  { id: "m10", category: "main_courses", title: { es: "Costillas BBQ", en: "BBQ ribs" }, price: 22.0 },
  { id: "b1", category: "beverages", title: { es: "Agua mineral", en: "Mineral water" }, price: 2.5 },
  { id: "b2", category: "beverages", title: { es: "Limonada natural", en: "Fresh lemonade" }, price: 4.0 },
  { id: "b3", category: "beverages", title: { es: "Jugo verde", en: "Green juice" }, price: 5.0 },
  { id: "b4", category: "beverages", title: { es: "Cafe espresso", en: "Espresso" }, price: 3.0 },
  { id: "b5", category: "beverages", title: { es: "Te herbal", en: "Herbal tea" }, price: 3.5 },
  { id: "b6", category: "beverages", title: { es: "Cerveza artesanal", en: "Craft beer" }, price: 6.0 },
  { id: "b7", category: "beverages", title: { es: "Vino tinto copa", en: "Red wine glass" }, price: 8.0 },
  { id: "b8", category: "beverages", title: { es: "Vino blanco copa", en: "White wine glass" }, price: 8.0 },
  { id: "b9", category: "beverages", title: { es: "Coctel de autor", en: "Signature cocktail" }, price: 10.0 },
  { id: "b10", category: "beverages", title: { es: "Mocktail tropical", en: "Tropical mocktail" }, price: 7.0 },
  { id: "d1", category: "desserts", title: { es: "Tiramisu", en: "Tiramisu" }, price: 7.5 },
  { id: "d2", category: "desserts", title: { es: "Cheesecake", en: "Cheesecake" }, price: 7.0 },
  { id: "d3", category: "desserts", title: { es: "Brownie caliente", en: "Warm brownie" }, price: 6.5 },
  { id: "d4", category: "desserts", title: { es: "Helado artesanal", en: "Artisan ice cream" }, price: 5.0 },
  { id: "d5", category: "desserts", title: { es: "Flan casero", en: "Homemade flan" }, price: 5.5 },
  { id: "d6", category: "desserts", title: { es: "Pie de limon", en: "Lemon pie" }, price: 6.0 },
  { id: "d7", category: "desserts", title: { es: "Creme brulee", en: "Creme brulee" }, price: 7.0 },
  { id: "d8", category: "desserts", title: { es: "Mousse de chocolate", en: "Chocolate mousse" }, price: 6.5 },
  { id: "d9", category: "desserts", title: { es: "Fruta fresca", en: "Fresh fruit" }, price: 5.0 },
  { id: "d10", category: "desserts", title: { es: "Coulant de cacao", en: "Chocolate coulant" }, price: 8.0 }
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

let lang = "es";
let activeCategory = "all";
let cart = read(STORAGE.cart, []);
let lastOrderUnsub = null;

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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1700);
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
          <img class="menu-photo" src="${itemImage(item)}" alt="${item.title[lang]}" loading="lazy">
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

function addToCart(id) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;
  const row = cart.find((c) => c.id === id);
  if (row) row.qty += 1;
  else cart.push({ id: item.id, title: item.title, price: item.price, qty: 1 });
  write(STORAGE.cart, cart);
  renderCart();
  showToast(`${item.title[lang]} ${t("addedToCart")}`);
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
        <h4>${row.title[lang]}</h4>
        <p>${money(row.price)} x ${row.qty}</p>
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

function renderTracker(order) {
  if (!order) {
    tracker.innerHTML = `<p>${t("trackerEmpty")}</p>`;
    return;
  }
  const createdAt = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());
  tracker.innerHTML = `
    <strong>${t("trackerLabel")}: #${order.displayId || order.id.slice(0, 6)}</strong>
    <p>${order.customer?.name || ""} | ${createdAt.toLocaleString(lang === "es" ? "es-ES" : "en-US")}</p>
    <p><strong>${statusLabel(order.status)}</strong></p>
  `;
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
    localStorage.setItem(STORAGE.lastOrderId, orderId);
    subscribeLastOrder(orderId);
    cart = [];
    write(STORAGE.cart, cart);
    renderCart();
    closeDrawer();
    showToast(t("orderSent"));
  } catch (_e) {
    showToast(t("orderError"));
  }
}

function subscribeLastOrder(orderId) {
  if (!orderId) {
    renderTracker();
    return;
  }
  if (lastOrderUnsub) lastOrderUnsub();
  lastOrderUnsub = listenOrderById(
    orderId,
    (order) => renderTracker(order),
    () => renderTracker()
  );
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
  if (button) addToCart(button.dataset.id);
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

const existingLastOrderId = localStorage.getItem(STORAGE.lastOrderId);
if (existingLastOrderId) subscribeLastOrder(existingLastOrderId);
applyI18n();
