import {
  listenOrders,
  listenReservations,
  updateOrderStatus,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  onAuthChange,
  signOutUser,
  isStaffAuthorized
} from "./firebase-config.js";

const i18n = {
  es: {
    authTitle: "Acceso CRM del personal",
    authText: "Inicia sesion con Google y valida rol de representante.",
    authButton: "Ingresar con Google",
    authDenied: "Tu usuario no tiene permisos CRM. Contacta al administrador.",
    authChecking: "Validando acceso...",
    crmTitle: "Panel de pedidos y reservas",
    crmSub: "Gestion operacional en tiempo real para representantes.",
    viewOrders: "Pedidos",
    viewReservations: "Reservas",
    filterAll: "Todos",
    filterPending: "Pendiente",
    filterInProgress: "En preparacion",
    filterAccepted: "Aceptado",
    filterRejected: "Rechazado",
    btnPending: "Pendiente",
    btnInProgress: "En preparacion",
    btnAccept: "Aceptar",
    btnReject: "Rechazar",
    review: "Revisar pedido",
    emptyOrders: "No hay pedidos en este estado.",
    emptyReservations: "No hay reservas registradas.",
    customer: "Cliente",
    total: "Total",
    date: "Fecha",
    status_pending: "Pendiente",
    status_in_progress: "En preparacion",
    status_accepted: "Aceptado",
    status_rejected: "Rechazado",
    reservationsCount: "Reservas",
    ordersCount: "Pedidos",
    pendingCount: "Pendientes",
    progressCount: "En preparacion",
    acceptedCount: "Aceptados",
    revenueCount: "Ingresos",
    avgTicket: "Ticket promedio",
    topFoodTitle: "Top comida vendida",
    topFoodEmpty: "No hay ventas aceptadas para este periodo.",
    qtySold: "Cantidad",
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
    authText: "Sign in with Google and validate representative role.",
    authButton: "Sign in with Google",
    authDenied: "Your user does not have CRM permissions. Contact the admin.",
    authChecking: "Validating access...",
    crmTitle: "Orders and reservations dashboard",
    crmSub: "Real-time operations view for representatives.",
    viewOrders: "Orders",
    viewReservations: "Reservations",
    filterAll: "All",
    filterPending: "Pending",
    filterInProgress: "In preparation",
    filterAccepted: "Accepted",
    filterRejected: "Rejected",
    btnPending: "Pending",
    btnInProgress: "In preparation",
    btnAccept: "Accept",
    btnReject: "Reject",
    review: "Review order",
    emptyOrders: "No orders for this status.",
    emptyReservations: "No reservations found.",
    customer: "Customer",
    total: "Total",
    date: "Date",
    status_pending: "Pending",
    status_in_progress: "In preparation",
    status_accepted: "Accepted",
    status_rejected: "Rejected",
    reservationsCount: "Reservations",
    ordersCount: "Orders",
    pendingCount: "Pending",
    progressCount: "In preparation",
    acceptedCount: "Accepted",
    revenueCount: "Revenue",
    avgTicket: "Average ticket",
    topFoodTitle: "Top food sold",
    topFoodEmpty: "No accepted sales for this period.",
    qtySold: "Qty",
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
const signInBtn = document.getElementById("crmSignIn");
const signOutBtn = document.getElementById("crmSignOut");
const crmApp = document.getElementById("crmApp");
const staffBadge = document.getElementById("staffBadge");

const ordersList = document.getElementById("ordersList");
const reservationsList = document.getElementById("reservationsList");
const statsGrid = document.getElementById("statsGrid");
const foodStats = document.getElementById("foodStats");
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
let unsubscribeOrders = null;
let unsubscribeReservations = null;

function t(key) {
  return (i18n[lang] && i18n[lang][key]) || key;
}

function money(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1600);
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
    <article class="stat-card"><p>${t("ordersCount")} (${t(`period_${activePeriod}`)})</p><h3>${periodOrders.length}</h3></article>
    <article class="stat-card"><p>${t("pendingCount")}</p><h3>${pending}</h3></article>
    <article class="stat-card"><p>${t("progressCount")}</p><h3>${progress}</h3></article>
    <article class="stat-card"><p>${t("acceptedCount")}</p><h3>${acceptedOrders.length}</h3></article>
    <article class="stat-card"><p>${t("reservationsCount")} (${t(`period_${activePeriod}`)})</p><h3>${periodReservations.length}</h3></article>
    <article class="stat-card"><p>${t("revenueCount")} (${t(`period_${activePeriod}`)})</p><h3>${money(revenue)}</h3></article>
    <article class="stat-card"><p>${t("avgTicket")}</p><h3>${money(avgTicket)}</h3></article>
  `;
}

function foodName(item) {
  return item.title?.[lang] || item.title?.es || item.title?.en || "Item";
}

function renderFoodStats() {
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
          .map(
            (row) =>
              `<li><span>${row.name}</span><strong>${t("qtySold")}: ${row.qty} | ${money(row.sales)}</strong></li>`
          )
          .join("")}
      </ul>
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
          <button class="btn btn-primary status-change" data-id="${order.id}" data-status="accepted">${t("btnAccept")}</button>
          <button class="btn danger status-change" data-id="${order.id}" data-status="rejected">${t("btnReject")}</button>
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
}

function startRealtime() {
  stopRealtime();
  unsubscribeOrders = listenOrders(
    (orders) => {
      ordersCache = orders;
      renderStats();
      renderFoodStats();
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

reviewPending.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "pending"));
reviewProgress.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "in_progress"));
reviewAccept.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "accepted"));
reviewReject.addEventListener("click", () => selectedOrderId && setStatus(selectedOrderId, "rejected"));
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

signInBtn.addEventListener("click", async () => {
  authMessage.textContent = t("authChecking");
  if (window.location.protocol === "file:") {
    authMessage.textContent = "Use http://localhost:3000/crm.html (not file://)";
    return;
  }
  try {
    await signInWithGooglePopup();
  } catch (error) {
    const code = error && error.code ? error.code : "unknown";
    const fallbackCodes = [
      "auth/popup-blocked",
      "auth/popup-closed-by-user",
      "auth/cancelled-popup-request"
    ];
    if (fallbackCodes.includes(code)) {
      authMessage.textContent = "Popup blocked. Redirecting to Google sign-in...";
      try {
        await signInWithGoogleRedirect();
        return;
      } catch (redirectError) {
        const redirectCode = redirectError && redirectError.code ? redirectError.code : "unknown";
        authMessage.textContent = `Sign-in failed (${redirectCode})`;
        return;
      }
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
