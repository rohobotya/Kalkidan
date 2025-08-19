import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// TODO: Replace with your Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

const adminEmail = "yaikobrohobot@gmail.com";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginDiv = document.getElementById("loginDiv");
const adminDiv = document.getElementById("adminDiv");
const ordersTableBody = document.querySelector("#ordersTable tbody");

loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(err => alert(err.message));
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user && user.email === adminEmail) {
    loginDiv.style.display = "none";
    adminDiv.style.display = "block";
    loadOrders();
  } else {
    loginDiv.style.display = "block";
    adminDiv.style.display = "none";
  }
});

function loadOrders() {
  onValue(ref(db, "orders"), (snapshot) => {
    ordersTableBody.innerHTML = "";
    snapshot.forEach((childSnap) => {
      let order = childSnap.val();
      let key = childSnap.key;

      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.city}</td>
        <td>${order.channel}</td>
        <td><a href="${order.paymentProof}" target="_blank">View</a></td>
        <td>${order.status}</td>
        <td>
          <button onclick="updateStatus('${key}', 'approved')">Approve</button>
          <button onclick="updateStatus('${key}', 'rejected')">Reject</button>
        </td>
      `;
      ordersTableBody.appendChild(row);
    });
  });
}

window.updateStatus = function(key, status) {
  update(ref(db, "orders/" + key), { status: status })
    .then(() => alert("Status updated to " + status))
    .catch((err) => alert("Error: " + err.message));
}
