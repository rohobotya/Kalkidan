// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBb8tKHIA67DM9t552t8q-plK4ketrA3lg",
  authDomain: "zowibranding.firebaseapp.com",
  databaseURL: "https://zowibranding-default-rtdb.firebaseio.com",
  projectId: "zowibranding",
  storageBucket: "zowibranding.firebasestorage.app",
  messagingSenderId: "43545840966",
  appId: "1:43545840966:web:35f96642aff40288a1a947",
  measurementId: "G-PYM4P96BXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
