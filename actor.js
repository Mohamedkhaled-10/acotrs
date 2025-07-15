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

// دالة لجلب الممثلات من Firebase
async function fetchActors() {
  const querySnapshot = await getDocs(collection(db, "actors"));
  querySnapshot.forEach((doc) => {
    const actor = doc.data();
    renderActorCard(actor);
  });
}

// دالة لعرض كل ممثلة
function renderActorCard(actor) {
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
}

// دالة فتح المودال
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
}

// إغلاق المودال
document.getElementById("closeModal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

// بدء التنفيذ
fetchActors();
