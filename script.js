import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// Handle form submission
document.getElementById("orderForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  let name = document.querySelector("input[name='name']").value;
  let phone = document.querySelector("input[name='phone']").value;
  let city = document.querySelector("input[name='city']").value;
  let address = document.querySelector("input[name='address']").value;
  let channel = document.querySelector("select[name='channel']").value;
  let file = document.querySelector("input[name='payment']").files[0];

  try {
    let storageRef = sRef(storage, 'payments/' + phone + "_" + file.name);
    await uploadBytes(storageRef, file);
    let downloadURL = await getDownloadURL(storageRef);

    let newOrderRef = push(ref(db, "orders"));
    await set(newOrderRef, {
      name: name,
      phone: phone,
      city: city,
      address: address,
      channel: channel,
      paymentProof: downloadURL,
      status: "pending",
      timestamp: new Date().toISOString()
    });

    alert("✅ Order submitted successfully!");
    document.getElementById("orderForm").reset();
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Error: " + error.message);
  }
});
