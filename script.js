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
