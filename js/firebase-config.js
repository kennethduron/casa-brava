import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoGrCHhAgGRDeNHRMVMXjZ0X8nQh-PC6I",
  authDomain: "restaurant-saas-84140.firebaseapp.com",
  projectId: "restaurant-saas-84140",
  storageBucket: "restaurant-saas-84140.firebasestorage.app",
  messagingSenderId: "230319625300",
  appId: "1:230319625300:web:f6cf1106eddab8c1cfc9c1",
  measurementId: "G-F51M8LWHS4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function normalizeOrderInput(order) {
  return {
    displayId: order.displayId || null,
    language: order.language || "es",
    customer: {
      name: (order.customer && order.customer.name) || "",
      phone: (order.customer && order.customer.phone) || ""
    },
    items: Array.isArray(order.items) ? order.items : [],
    total: Number(order.total || 0),
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

async function addOrder(order) {
  const payload = normalizeOrderInput(order);
  const ref = await addDoc(collection(db, "orders"), payload);
  return ref.id;
}

async function addReservation(reservation) {
  const payload = {
    name: reservation.name || "",
    phone: reservation.phone || "",
    email: reservation.email || "",
    date: reservation.date || "",
    time: reservation.time || "",
    party: Number(reservation.party || 1),
    occasion: reservation.occasion || "",
    allergies: reservation.allergies || "",
    notes: reservation.notes || "",
    language: reservation.language || "es",
    createdAt: serverTimestamp()
  };
  const ref = await addDoc(collection(db, "reservations"), payload);
  return ref.id;
}

function listenOrders(successCb, errorCb) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const rows = snapshot.docs.map((row) => ({ id: row.id, ...row.data() }));
      successCb(rows);
    },
    (error) => {
      if (typeof errorCb === "function") errorCb(error);
    }
  );
}

function listenReservations(successCb, errorCb) {
  const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const rows = snapshot.docs.map((row) => ({ id: row.id, ...row.data() }));
      successCb(rows);
    },
    (error) => {
      if (typeof errorCb === "function") errorCb(error);
    }
  );
}

function listenOrderById(orderId, successCb, errorCb) {
  const ref = doc(db, "orders", orderId);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        successCb(null);
        return;
      }
      successCb({ id: snapshot.id, ...snapshot.data() });
    },
    (error) => {
      if (typeof errorCb === "function") errorCb(error);
    }
  );
}

async function updateOrderStatus(id, status, staffUser) {
  const ref = doc(db, "orders", id);
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
    updatedBy: {
      uid: staffUser && staffUser.uid ? staffUser.uid : "",
      email: staffUser && staffUser.email ? staffUser.email : ""
    }
  });
}

async function getStaffProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, "staff", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
}

async function isStaffAuthorized(user) {
  if (!user) return { allowed: false, reason: "No user" };
  const profile = await getStaffProfile(user.uid);
  if (!profile) return { allowed: false, reason: "Missing staff profile" };
  const role = String(profile.role || "").toLowerCase();
  const active = Boolean(profile.active);
  const allowedRoles = ["admin", "agent", "representative"];
  if (!active || !allowedRoles.includes(role)) {
    return { allowed: false, reason: "Inactive or invalid role", profile };
  }
  return { allowed: true, profile };
}

async function signInWithGooglePopup() {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

async function signInWithGoogleRedirect() {
  await signInWithRedirect(auth, googleProvider);
}

function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

async function signOutUser() {
  await signOut(auth);
}

export {
  app,
  db,
  auth,
  addOrder,
  addReservation,
  listenOrders,
  listenReservations,
  listenOrderById,
  updateOrderStatus,
  getStaffProfile,
  isStaffAuthorized,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  onAuthChange,
  signOutUser
};
