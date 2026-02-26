import {
  listenOrders,
  listenReservations,
  updateOrderStatus,
  signInWithEmailPassword,
  getEmailByUsername,
  onAuthChange,
  signOutUser,
  isStaffAuthorized
} from "./firebase-config.js";

const i18n = {
  es: {
    authTitle: "Acceso CRM del personal",
    authText: "Ingresa con usuario y contrasena para validar rol de representante.",
    authUserLabel: "Usuario",
    authPassLabel: "Contrasena",
    authButton: "Ingresar",
    authInvalid: "Usuario o contrasena invalidos.",
    authUserNotFound: "Usuario no encontrado.",
    authDenied: "Tu usuario no tiene permisos CRM. Contacta al administrador.",
    authChecking: "Validando acceso...",
    crmTitle: "Panel de pedidos y reservas",
    crmSub: "Gestion operacional en tiempo real para representantes.",
    viewOrders: "Pedidos",
    viewReservations: "Reservas",
    filterAll: "Todos",
    filterPending: "Pendiente",
    filterInProgress: "En preparacion",
    filterAccepted: "Entregado",
    filterRejected: "Rechazado",
    btnPending: "Pendiente",
    btnInProgress: "En preparacion",
    btnAccept: "Entregar",
    btnReject: "Rechazar",
    review: "Revisar pedido",
    emptyOrders: "No hay pedidos en este estado.",
    emptyReservations: "No hay reservas registradas.",
    customer: "Cliente",
    total: "Total",
    date: "Fecha",
    status_pending: "Pendiente",
    status_in_progress: "En preparacion",
    status_accepted: "Entregado",
    status_rejected: "Rechazado",
    reservationsCount: "Reservas",
    ordersCount: "Pedidos",
    pendingCount: "Pendientes",
    progressCount: "En preparacion",
    acceptedCount: "Entregados",
    revenueCount: "Ingresos",
    avgTicket: "Ticket promedio",
    statsSummary: "Resumen",
    statsOps: "Operacion",
    statsSales: "Ventas",
    topFoodTitle: "Top comida vendida",
    topFoodEmpty: "No hay ventas aceptadas para este periodo.",
    calendarTitle: "Calendario de ventas",
    calendarSub: "Selecciona fecha para revisar ventas entregadas y sus pedidos.",
    calendarNoSalesMonth: "No hay ventas entregadas en este mes.",
    calendarNoSalesDay: "No hay ventas entregadas en esta fecha.",
    calendarOrders: "Pedidos",
    calendarRevenue: "Ingresos",
    calendarDetailsTitle: "Detalle del dia",
    calendarPrev: "Mes anterior",
    calendarNext: "Mes siguiente",
    calendarFoodBreakdown: "Comida vendida ese dia",
    qtySold: "Cantidad",
    salesLabel: "Ventas",
    period_day: "Hoy",
    period_week: "Semana",
    period_month: "Mes",
    updated: "Estado actualizado",
    staffRole: "Rol",
    signOut: "Cerrar sesion",
    signOutShort: "Salir"
  },
  en: {
    authTitle: "Staff CRM access",
    authText: "Sign in with username and password to validate representative role.",
    authUserLabel: "Username",
    authPassLabel: "Password",
    authButton: "Sign in",
    authInvalid: "Invalid username or password.",
    authUserNotFound: "Username not found.",
    authDenied: "Your user does not have CRM permissions. Contact the admin.",
    authChecking: "Validating access...",
    crmTitle: "Orders and reservations dashboard",
    crmSub: "Real-time operations view for representatives.",
    viewOrders: "Orders",
    viewReservations: "Reservations",
    filterAll: "All",
    filterPending: "Pending",
    filterInProgress: "In preparation",
    filterAccepted: "Delivered",
    filterRejected: "Rejected",
    btnPending: "Pending",
    btnInProgress: "In preparation",
    btnAccept: "Deliver",
    btnReject: "Reject",
    review: "Review order",
    emptyOrders: "No orders for this status.",
    emptyReservations: "No reservations found.",
    customer: "Customer",
    total: "Total",
    date: "Date",
    status_pending: "Pending",
    status_in_progress: "In preparation",
    status_accepted: "Delivered",
    status_rejected: "Rejected",
    reservationsCount: "Reservations",
    ordersCount: "Orders",
    pendingCount: "Pending",
    progressCount: "In preparation",
    acceptedCount: "Delivered",
    revenueCount: "Revenue",
    avgTicket: "Average ticket",
    statsSummary: "Summary",
    statsOps: "Operations",
    statsSales: "Sales",
    topFoodTitle: "Top food sold",
    topFoodEmpty: "No accepted sales for this period.",
    calendarTitle: "Sales calendar",
    calendarSub: "Pick a date to review delivered sales and order details.",
    calendarNoSalesMonth: "No delivered sales in this month.",
    calendarNoSalesDay: "No delivered sales on this date.",
    calendarOrders: "Orders",
    calendarRevenue: "Revenue",
    calendarDetailsTitle: "Day details",
    calendarPrev: "Previous month",
    calendarNext: "Next month",
    calendarFoodBreakdown: "Food sold that day",
    qtySold: "Qty",
    salesLabel: "Sales",
    period_day: "Today",
    period_week: "Week",
    period_month: "Month",
    updated: "Status updated",
    staffRole: "Role",
    signOut: "Sign out",
    signOutShort: "Out"
  }
};

const authGate = document.getElementById("authGate");
const authMessage = document.getElementById("authMessage");
const authForm = document.getElementById("crmAuthForm");
const authUser = document.getElementById("crmUser");
const authPassword = document.getElementById("crmPassword");
const signOutBtn = document.getElementById("crmSignOut");
const crmApp = document.getElementById("crmApp");
const staffBadge = document.getElementById("staffBadge");

const ordersList = document.getElementById("ordersList");
const reservationsList = document.getElementById("reservationsList");
const statsGrid = document.getElementById("statsGrid");
const foodStats = document.getElementById("foodStats");
const salesCalendar = document.getElementById("salesCalendar");
const viewButtons = Array.from(document.querySelectorAll(".chip[data-view]"));
const filterButtons = Array.from(document.querySelectorAll(".chip[data-filter]"));
const periodButtons = Array.from(document.querySelectorAll(".chip[data-period]"));
const ordersView = document.getElementById("ordersView");
const reservationsView = document.getElementById("reservationsView");
const reviewModal = document.getElementById("reviewModal");
const reviewTitle = document.getElementById("reviewTitle");
const reviewBody = document.getElementById("reviewBody");
const closeReview = document.getElementById("closeReview");
const reviewPending = document.getElementById("reviewPending");
const reviewProgress = document.getElementById("reviewProgress");
const reviewAccept = document.getElementById("reviewAccept");
const reviewReject = document.getElementById("reviewReject");
const langToggle = document.getElementById("crmLangToggle");
const toast = document.getElementById("toast");

let lang = "es";
let activeFilter = "all";
let selectedOrderId = null;
let currentStaffUser = null;
let currentStaffProfile = null;
let ordersCache = [];
let reservationsCache = [];
let activePeriod = "day";
let calendarMonth = (() => {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now;
})();
let selectedCalendarDate = null;
let unsubscribeOrders = null;
let unsubscribeReservations = null;
let hasSeenInitialOrdersSnapshot = false;
let knownOrderIds = new Set();
let audioCtx = null;
let audioUnlocked = false;

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
  setTimeout(() => toast.classList.remove("show"), 1600);
}

function canUseBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

function canUseWebAudio() {
  return typeof window !== "undefined" && ("AudioContext" in window || "webkitAudioContext" in window);
}

function getAudioContext() {
  if (!canUseWebAudio()) return null;
  if (audioCtx) return audioCtx;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioCtx();
  } catch (_e) {
    audioCtx = null;
  }
  return audioCtx;
}

async function unlockNotificationSound() {
  const ctx = getAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === "suspended") await ctx.resume();
    audioUnlocked = ctx.state === "running";
  } catch (_e) {
    audioUnlocked = false;
  }
  return audioUnlocked;
}

function playNewOrderSound() {
  if (!audioUnlocked) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const beepOffsets = [0, 0.23];
  beepOffsets.forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now + offset);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.2);
  });
}

async function ensureNotificationPermission() {
  if (!canUseBrowserNotifications()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch (_e) {
    return "denied";
  }
}

function notifyNewOrder(order) {
  const orderRef = `#${order.displayId || order.id.slice(0, 6)}`;
  const customerName = order.customer?.name || "-";
  const totalText = money(order.total);
  const title = lang === "es" ? "Nuevo pedido recibido" : "New order received";
  const body =
    lang === "es"
      ? `${orderRef} | ${customerName} | ${totalText}`
      : `${orderRef} | ${customerName} | ${totalText}`;

  showToast(`${title}: ${orderRef}`);
  playNewOrderSound();
  if (!canUseBrowserNotifications() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch (_e) {
    // Ignore notification errors and keep toast feedback.
  }
}

function orderStatusLabel(status) {
  return t(`status_${status}`);
}

function formatDate(value) {
  if (!value) return "-";
  const date = value.toDate ? value.toDate() : new Date(value);
  return date.toLocaleString(lang === "es" ? "es-ES" : "en-US");
}

function parseDate(value) {
  if (!value) return null;
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function periodStart(now, period) {
  const start = new Date(now);
  if (period === "day") {
    start.setHours(0, 0, 0, 0);
    return start;
  }
  if (period === "week") {
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

function inActivePeriod(value) {
  const date = parseDate(value);
  if (!date) return false;
  const now = new Date();
  const start = periodStart(now, activePeriod);
  return date >= start && date <= now;
}

function salesRowsForPeriod() {
  return ordersCache.filter((order) => inActivePeriod(order.createdAt));
}

function reservationsForPeriod() {
  return reservationsCache.filter((res) => inActivePeriod(res.createdAt));
}

function acceptedSalesRows() {
  return salesRowsForPeriod().filter((order) => order.status === "accepted");
}

function applyI18n() {
  document.documentElement.lang = lang;
  langToggle.textContent = lang === "es" ? "EN" : "ES";
  const shortLabel = window.matchMedia("(max-width: 560px)").matches;
  signOutBtn.textContent = shortLabel ? t("signOutShort") : t("signOut");
  periodButtons.forEach((button) => {
    const label = t(`period_${button.dataset.period}`);
    button.textContent = label;
  });
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  renderStats();
  renderFoodStats();
  renderSalesCalendar();
  renderOrders();
  renderReservations();
}

function filteredOrders() {
  return ordersCache.filter((o) => (activeFilter === "all" ? true : o.status === activeFilter));
}

function renderStats() {
  const periodOrders = salesRowsForPeriod();
  const periodReservations = reservationsForPeriod();
  const pending = periodOrders.filter((o) => o.status === "pending").length;
  const progress = periodOrders.filter((o) => o.status === "in_progress").length;
  const acceptedOrders = periodOrders.filter((o) => o.status === "accepted");
  const revenue = acceptedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const avgTicket = acceptedOrders.length ? revenue / acceptedOrders.length : 0;
  statsGrid.innerHTML = `
    <article class="stats-panel-card">
      <header class="stats-panel-head">
        <h3>${t("statsSummary")} (${t(`period_${activePeriod}`)})</h3>
      </header>
      <div class="stats-groups">
        <section class="stats-group">
          <h4>${t("statsOps")}</h4>
          <div class="stats-subgrid">
            <article class="stat-card tone-neutral"><p>${t("ordersCount")}</p><h3>${periodOrders.length}</h3></article>
            <article class="stat-card tone-warn"><p>${t("pendingCount")}</p><h3>${pending}</h3></article>
            <article class="stat-card tone-progress"><p>${t("progressCount")}</p><h3>${progress}</h3></article>
            <article class="stat-card tone-ok"><p>${t("acceptedCount")}</p><h3>${acceptedOrders.length}</h3></article>
            <article class="stat-card tone-neutral"><p>${t("reservationsCount")}</p><h3>${periodReservations.length}</h3></article>
          </div>
        </section>
        <section class="stats-group">
          <h4>${t("statsSales")}</h4>
          <div class="stats-subgrid stats-subgrid-sales">
            <article class="stat-card tone-sales"><p>${t("revenueCount")}</p><h3>${money(revenue)}</h3></article>
            <article class="stat-card tone-sales-soft"><p>${t("avgTicket")}</p><h3>${money(avgTicket)}</h3></article>
          </div>
        </section>
      </div>
    </article>
  `;
}

function foodName(item) {
  return item.title?.[lang] || item.title?.es || item.title?.en || "Item";
}

function dayKeyFromDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthKeyFromDate(date) {
  return dayKeyFromDate(date).slice(0, 7);
}

function monthLabel(date) {
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { month: "long", year: "numeric" });
}

function timeLabel(value) {
  const date = parseDate(value);
  if (!date) return "-";
  return date.toLocaleTimeString(lang === "es" ? "es-ES" : "en-US", { hour: "2-digit", minute: "2-digit" });
}

function calendarWeekdayLabels() {
  return lang === "es"
    ? ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

function salesByDayForMonth(referenceMonth) {
  const month = referenceMonth.getMonth();
  const year = referenceMonth.getFullYear();
  const map = new Map();
  ordersCache
    .filter((order) => order.status === "accepted")
    .forEach((order) => {
      const when = parseDate(order.createdAt);
      if (!when) return;
      if (when.getMonth() !== month || when.getFullYear() !== year) return;
      const key = dayKeyFromDate(when);
      const row = map.get(key) || { orders: [], count: 0, revenue: 0 };
      row.orders.push(order);
      row.count += 1;
      row.revenue += Number(order.total || 0);
      map.set(key, row);
    });
  return map;
}

function renderFoodStats() {
  if (!foodStats) return;
  const acceptedOrders = acceptedSalesRows();
  const byFood = new Map();

  acceptedOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = item.id || foodName(item);
      const existing = byFood.get(key) || { name: foodName(item), qty: 0, sales: 0 };
      const qty = Number(item.qty || 0);
      const lineTotal = qty * Number(item.price || 0);
      existing.qty += qty;
      existing.sales += lineTotal;
      byFood.set(key, existing);
    });
  });

  const topRows = Array.from(byFood.values()).sort((a, b) => b.qty - a.qty).slice(0, 8);
  if (!topRows.length) {
    foodStats.innerHTML = `
      <article class="food-stats-card">
        <h3>${t("topFoodTitle")} (${t(`period_${activePeriod}`)})</h3>
        <p>${t("topFoodEmpty")}</p>
      </article>
    `;
    return;
  }

  foodStats.innerHTML = `
    <article class="food-stats-card">
      <h3>${t("topFoodTitle")} (${t(`period_${activePeriod}`)})</h3>
      <ul>
        ${topRows
          .map((row, index) => `
            <li>
              <span class="food-rank">#${index + 1}</span>
              <span class="food-name">${row.name}</span>
              <span class="food-metrics">
                <em>${t("qtySold")}: ${row.qty}</em>
                <strong>${t("salesLabel")}: ${money(row.sales)}</strong>
              </span>
            </li>
          `)
          .join("")}
      </ul>
    </article>
  `;
}

function renderSalesCalendar() {
  if (!salesCalendar) return;
  const monthSales = salesByDayForMonth(calendarMonth);
  const firstOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDayOffset = (firstOfMonth.getDay() + 6) % 7;
  const monthKey = monthKeyFromDate(firstOfMonth);
  const dayCells = [];

  if (!selectedCalendarDate || !selectedCalendarDate.startsWith(monthKey)) {
    selectedCalendarDate = monthSales.size ? Array.from(monthSales.keys())[0] : `${monthKey}-01`;
  }

  for (let i = 0; i < firstDayOffset; i += 1) {
    dayCells.push('<div class="calendar-cell muted" aria-hidden="true"></div>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const key = dayKeyFromDate(date);
    const bucket = monthSales.get(key);
    const selected = selectedCalendarDate === key ? "selected" : "";
    const hasSales = bucket ? "has-sales" : "";
    dayCells.push(`
      <button class="calendar-cell day ${selected} ${hasSales}" data-calendar-date="${key}">
        <span class="calendar-day">${day}</span>
        <span class="calendar-meta">${bucket ? `${bucket.count} ${t("calendarOrders")}` : "-"}</span>
      </button>
    `);
  }

  const selectedBucket = monthSales.get(selectedCalendarDate) || null;
  const dayFoodRows = (() => {
    if (!selectedBucket) return [];
    const byFood = new Map();
    selectedBucket.orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.id || foodName(item);
        const existing = byFood.get(key) || { name: foodName(item), qty: 0, sales: 0 };
        const qty = Number(item.qty || 0);
        existing.qty += qty;
        existing.sales += qty * Number(item.price || 0);
        byFood.set(key, existing);
      });
    });
    return Array.from(byFood.values()).sort((a, b) => b.qty - a.qty);
  })();
  const selectedDateObject = new Date(`${selectedCalendarDate}T00:00:00`);
  const selectedDateLabel = Number.isNaN(selectedDateObject.getTime())
    ? selectedCalendarDate
    : selectedDateObject.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });

  salesCalendar.innerHTML = `
    <article class="sales-calendar-card">
      <header class="sales-calendar-head">
        <div>
          <h3>${t("calendarTitle")}</h3>
          <p>${t("calendarSub")}</p>
        </div>
        <div class="sales-calendar-nav">
          <button class="btn btn-outline" data-calendar-shift="-1" aria-label="${t("calendarPrev")}">&lt;</button>
          <strong>${monthLabel(calendarMonth)}</strong>
          <button class="btn btn-outline" data-calendar-shift="1" aria-label="${t("calendarNext")}">&gt;</button>
        </div>
      </header>
      <div class="sales-calendar-grid">
        ${calendarWeekdayLabels().map((label) => `<div class="calendar-cell weekday">${label}</div>`).join("")}
        ${dayCells.join("")}
      </div>
      ${monthSales.size ? "" : `<p class="calendar-empty-month">${t("calendarNoSalesMonth")}</p>`}
      <section class="sales-day-details">
        <h4>${t("calendarDetailsTitle")}: ${selectedDateLabel}</h4>
        ${
          selectedBucket
            ? `
              <p><strong>${t("calendarOrders")}:</strong> ${selectedBucket.count} | <strong>${t("calendarRevenue")}:</strong> ${money(selectedBucket.revenue)}</p>
              <div class="sales-day-list">
                ${selectedBucket.orders
                  .map(
                    (order) => `
                      <article class="sales-day-row">
                        <div>
                          <strong>#${order.displayId || order.id.slice(0, 6)}</strong>
                          <p>${t("customer")}: ${order.customer?.name || "-"} (${order.customer?.phone || "-"})</p>
                          <p>${timeLabel(order.createdAt)} | ${money(order.total)}</p>
                        </div>
                        <button class="btn btn-outline" data-review-order="${order.id}">${t("review")}</button>
                      </article>
                    `
                  )
                  .join("")}
              </div>
              <div class="sales-food-breakdown">
                <h5>${t("calendarFoodBreakdown")}</h5>
                ${
                  dayFoodRows.length
                    ? `
                      <ul>
                        ${dayFoodRows
                          .map(
                            (row) => `
                              <li>
                                <span>${row.name}</span>
                                <span>${t("qtySold")}: ${row.qty} | ${t("salesLabel")}: ${money(row.sales)}</span>
                              </li>
                            `
                          )
                          .join("")}
                      </ul>
                    `
                    : `<p>${t("calendarNoSalesDay")}</p>`
                }
              </div>
            `
            : `<p>${t("calendarNoSalesDay")}</p>`
        }
      </section>
    </article>
  `;
}

function renderOrders() {
  const rows = filteredOrders();
  if (!rows.length) {
    ordersList.innerHTML = `<p>${t("emptyOrders")}</p>`;
    return;
  }

  ordersList.innerHTML = rows
    .map((order) => `
      <article class="crm-card">
        <div class="crm-top">
          <div>
            <strong>#${order.displayId || order.id.slice(0, 6)}</strong>
            <p>${t("customer")}: ${order.customer?.name || ""} (${order.customer?.phone || ""})</p>
          </div>
          <span class="badge ${order.status}">${orderStatusLabel(order.status)}</span>
        </div>
        <p>${t("total")}: <strong>${money(order.total)}</strong></p>
        <p>${t("date")}: ${formatDate(order.createdAt)}</p>
        <div class="crm-actions">
          <button class="btn btn-outline review-order" data-id="${order.id}">${t("review")}</button>
          <button class="btn btn-outline status-change" data-id="${order.id}" data-status="pending">${t("btnPending")}</button>
          <button class="btn btn-outline status-change" data-id="${order.id}" data-status="in_progress">${t("btnInProgress")}</button>
          <div class="final-actions">
            <button class="btn btn-primary status-change accept-main" data-id="${order.id}" data-status="accepted">${t("btnAccept")}</button>
            <button class="btn danger status-change reject-tiny" data-id="${order.id}" data-status="rejected">${t("btnReject")}</button>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderReservations() {
  if (!reservationsCache.length) {
    reservationsList.innerHTML = `<p>${t("emptyReservations")}</p>`;
    return;
  }

  reservationsList.innerHTML = reservationsCache
    .map((res) => `
      <article class="crm-card">
        <div class="crm-top">
          <div>
            <strong>${res.name || "-"}</strong>
            <p>${res.phone || ""}${res.email ? ` | ${res.email}` : ""}</p>
          </div>
          <span class="badge pending">${res.party || 1} pax</span>
        </div>
        <p>${t("date")}: ${res.date || "-"} ${res.time || ""}</p>
        <p>Occasion: ${res.occasion || "-"}</p>
        <p>Allergies: ${res.allergies || "-"}</p>
        <p>Notes: ${res.notes || "-"}</p>
      </article>
    `)
    .join("");
}

function openReview(orderId) {
  const order = ordersCache.find((o) => o.id === orderId);
  if (!order) return;
  selectedOrderId = orderId;
  reviewTitle.textContent = `#${order.displayId || order.id.slice(0, 6)}`;
  reviewBody.innerHTML = `
    <p>${t("customer")}: <strong>${order.customer?.name || ""}</strong> (${order.customer?.phone || ""})</p>
    <p>${t("date")}: ${formatDate(order.createdAt)}</p>
    <p>${t("total")}: <strong>${money(order.total)}</strong></p>
    <ul>
      ${(order.items || [])
        .map((item) => `<li>${item.title?.[lang] || item.title?.es || item.title?.en || "Item"} x ${item.qty} (${money(item.price)})</li>`)
        .join("")}
    </ul>
    <p><strong>${orderStatusLabel(order.status)}</strong></p>
  `;
  reviewModal.classList.remove("hidden");
}

function closeReviewModal() {
  selectedOrderId = null;
  reviewModal.classList.add("hidden");
}

async function setStatus(orderId, status) {
  try {
    await updateOrderStatus(orderId, status, currentStaffUser);
    showToast(t("updated"));
  } catch (_e) {
    showToast("Error");
  }
}

function stopRealtime() {
  if (unsubscribeOrders) unsubscribeOrders();
  if (unsubscribeReservations) unsubscribeReservations();
  unsubscribeOrders = null;
  unsubscribeReservations = null;
  hasSeenInitialOrdersSnapshot = false;
  knownOrderIds = new Set();
}

function startRealtime() {
  stopRealtime();
  unsubscribeOrders = listenOrders(
    (orders) => {
      const nextIds = new Set(orders.map((order) => order.id));
      if (!hasSeenInitialOrdersSnapshot) {
        knownOrderIds = nextIds;
        hasSeenInitialOrdersSnapshot = true;
      } else {
        const newOrders = orders.filter((order) => !knownOrderIds.has(order.id));
        newOrders.forEach((order) => notifyNewOrder(order));
        knownOrderIds = nextIds;
      }

      ordersCache = orders;
      renderStats();
      renderFoodStats();
      renderSalesCalendar();
      renderOrders();
      if (selectedOrderId) openReview(selectedOrderId);
    },
    () => showToast("Orders listener error")
  );

  unsubscribeReservations = listenReservations(
    (reservations) => {
      reservationsCache = reservations;
      renderStats();
      renderReservations();
    },
    () => showToast("Reservations listener error")
  );
}

function lockUI() {
  authGate.classList.remove("hidden");
  crmApp.classList.add("hidden");
  signOutBtn.classList.add("hidden");
  staffBadge.textContent = "";
  stopRealtime();
}

function unlockUI(user, profile) {
  authGate.classList.add("hidden");
  crmApp.classList.remove("hidden");
  signOutBtn.classList.remove("hidden");
  staffBadge.textContent = `${user.email} | ${t("staffRole")}: ${profile.role}`;
  ensureNotificationPermission();
  unlockNotificationSound();
  startRealtime();
}

ordersList.addEventListener("click", (event) => {
  const reviewButton = event.target.closest(".review-order");
  if (reviewButton) {
    openReview(reviewButton.dataset.id);
    return;
  }
  const statusButton = event.target.closest(".status-change");
  if (statusButton) setStatus(statusButton.dataset.id, statusButton.dataset.status);
});

if (salesCalendar) {
  salesCalendar.addEventListener("click", (event) => {
    const shiftBtn = event.target.closest("[data-calendar-shift]");
    if (shiftBtn) {
      const shift = Number(shiftBtn.dataset.calendarShift || 0);
      calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + shift, 1);
      renderSalesCalendar();
      return;
    }

    const dayBtn = event.target.closest("[data-calendar-date]");
    if (dayBtn) {
      selectedCalendarDate = dayBtn.dataset.calendarDate;
      renderSalesCalendar();
      return;
    }

    const reviewBtn = event.target.closest("[data-review-order]");
    if (reviewBtn) {
      openReview(reviewBtn.dataset.reviewOrder);
    }
  });
}

if (reviewPending) reviewPending.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "pending"));
if (reviewProgress) reviewProgress.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "in_progress"));
if (reviewAccept) reviewAccept.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "accepted"));
if (reviewReject) reviewReject.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "rejected"));
closeReview.addEventListener("click", closeReviewModal);
reviewModal.addEventListener("click", (event) => {
  if (event.target === reviewModal) closeReviewModal();
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const view = button.dataset.view;
    if (view === "orders") {
      ordersView.classList.remove("hidden");
      reservationsView.classList.add("hidden");
    } else {
      ordersView.classList.add("hidden");
      reservationsView.classList.remove("hidden");
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderOrders();
  });
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    periodButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    activePeriod = button.dataset.period;
    renderStats();
    renderFoodStats();
  });
});

langToggle.addEventListener("click", () => {
  lang = lang === "es" ? "en" : "es";
  applyI18n();
});

window.addEventListener("resize", applyI18n);
window.addEventListener("pointerdown", unlockNotificationSound, { once: true });
window.addEventListener("keydown", unlockNotificationSound, { once: true });

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = authUser.value.trim();
  const password = authPassword.value;

  if (!username || !password) {
    authMessage.textContent = t("authInvalid");
    return;
  }

  authMessage.textContent = t("authChecking");
  try {
    const email = username.includes("@") ? username : await getEmailByUsername(username);
    if (!email) {
      authMessage.textContent = t("authUserNotFound");
      return;
    }
    await signInWithEmailPassword(email, password);
    authPassword.value = "";
  } catch (error) {
    const code = error && error.code ? error.code : "unknown";
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      authMessage.textContent = t("authInvalid");
      return;
    }
    authMessage.textContent = `Sign-in failed (${code})`;
  }
});

signOutBtn.addEventListener("click", async () => {
  await signOutUser();
  lockUI();
});

onAuthChange(async (user) => {
  if (!user) {
    currentStaffUser = null;
    currentStaffProfile = null;
    authMessage.textContent = "";
    lockUI();
    return;
  }

  currentStaffUser = user;
  authMessage.textContent = t("authChecking");
  const access = await isStaffAuthorized(user);
  if (!access.allowed) {
    currentStaffProfile = null;
    authMessage.textContent = t("authDenied");
    await signOutUser();
    lockUI();
    return;
  }

  currentStaffProfile = access.profile;
  authMessage.textContent = "";
  unlockUI(user, currentStaffProfile);
});

applyI18n();
lockUI();
