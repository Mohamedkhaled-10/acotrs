import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHdytx9Zicc4gi92fJz6b3IPnrAweLLp0",
  authDomain: "actor-d244f.firebaseapp.com",
  projectId: "actor-d244f",
  storageBucket: "actor-d244f.firebasestorage.app",
  messagingSenderId: "163741303451",
  appId: "1:163741303451:web:10bde58d517cb15c94bc3e",
  measurementId: "G-WNGKV3EVQK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const actorsContainer = document.getElementById("actorsContainer");

let visibleActors = [];
let lockedActors = [];

// دالة لجلب الممثلات من Firebase
async function fetchActors() {
  const querySnapshot = await getDocs(collection(db, "actors"));
  let allActors = [];

  querySnapshot.forEach((doc) => {
    const actor = doc.data();
    allActors.push(actor);
  });

  // قسمهم حسب السيريال
  visibleActors = allActors.filter((a, i) => !a.serial && i < 3);
  lockedActors = allActors.filter((a) => a.serial);

  displayActors(visibleActors);
  showSerialInput();
}

// عرض الكروت
function displayActors(list) {
  actorsContainer.innerHTML = "";

  list.forEach(actor => {
    const card = document.createElement("div");
    card.className = "actor-card";

    card.innerHTML = `
      <img src="${actor.image}" alt="${actor.name}" class="actor-image"/>
      <h3>${actor.name}</h3>
      <p><strong>تاريخ الميلاد:</strong> ${actor.birthDate}</p>
      <p><strong>الجوائز:</strong> ${actor.awards}</p>
      <p><strong>أفلام:</strong> ${actor.movies.join(", ")}</p>
      <button onclick='showModal(${JSON.stringify(actor)})'>عرض التفاصيل</button>
    `;

    actorsContainer.appendChild(card);
  });
}

// إظهار خانة السيريال
function showSerialInput() {
  const serialBox = document.createElement("div");
  serialBox.className = "serial-box";
  serialBox.innerHTML = `
    <input type="text" id="serialInput" placeholder="ادخل السيريال لفتح ممثلة مخفية" />
    <button id="unlockBtn">فتح</button>
  `;
  actorsContainer.appendChild(serialBox);

  document.getElementById("unlockBtn").addEventListener("click", () => {
    const code = document.getElementById("serialInput").value.trim();
    const found = lockedActors.find((a) => a.serial === code);

    if (found && !visibleActors.some((a) => a.name === found.name)) {
      visibleActors.push(found);
      displayActors(visibleActors);
      showSerialInput(); // إعادة زر السيريال
    } else {
      alert("❌ السيريال غير صحيح أو هذه الممثلة معروضة بالفعل.");
    }
  });
}

// المودال
window.showModal = function(actor) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  modal.classList.remove("hidden");

  modalBody.innerHTML = `
    <h2>${actor.name}</h2>
    <img src="${actor.image}" alt="${actor.name}" class="actor-image-large"/>
    <p>${actor.bio}</p>
    <p><strong>الموقع الرسمي:</strong> <a href="${actor.website}" target="_blank">${actor.website}</a></p>
    <div class="gallery">
      ${actor.gallery.map(img => `<img src="${img}" class="gallery-img" />`).join("")}
    </div>
  `;
};

document.getElementById("closeModal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

fetchActors();
