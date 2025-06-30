const actorsContainer = document.getElementById("actorsContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

let actorsData = [];

// تحميل بيانات الممثلين من ملف JSON
async function loadActors() {
  try {
    const response = await fetch("actors.json");
    actorsData = await response.json();
    displayActors(actorsData);
  } catch (error) {
    actorsContainer.innerHTML = "<p>خطأ في تحميل بيانات الممثلين.</p>";
    console.error(error);
  }
}

// عرض قائمة الممثلين
function displayActors(actors) {
  if (actors.length === 0) {
    actorsContainer.innerHTML = "<p>لم يتم العثور على ممثلين.</p>";
    return;
  }

  actorsContainer.innerHTML = actors
    .map(
      (actor) => `
      <div class="actor-card" onclick="showDetails('${actor.id}')">
        <img src="${actor.image}" alt="${actor.name}" />
        <h3>${actor.name}</h3>
        <p>${actor.bio}</p>
        <button class="details-btn">التفاصيل</button>
      </div>
    `
    )
    .join("");
}

// عرض تفاصيل الممثل في نافذة منبثقة
function showDetails(id) {
  const actor = actorsData.find((a) => a.id === id);
  if (!actor) return;

  modalBody.innerHTML = `
    <h2>${actor.name}</h2>
    <img src="${actor.image}" alt="${actor.name}" />
    <p><strong>تاريخ الميلاد:</strong> ${actor.birthDate}</p>
    <p>${actor.bio}</p>
    <h3>أفلام:</h3>
    <ul class="movies-list">
      ${actor.movies.map((movie) => `<li>${movie}</li>`).join("")}
    </ul>
    ${
      actor.video
        ? `<video controls>
            <source src="${actor.video}" type="video/mp4" />
            المتصفح لا يدعم عرض الفيديو.
          </video>`
        : ""
    }
  `;

  modal.classList.remove("hidden");
}

// إغلاق النافذة المنبثقة
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// إغلاق المودال عند الضغط خارج المحتوى
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// بحث حي حسب الاسم
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = actorsData.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm)
  );
  displayActors(filtered);
});

// تحميل البيانات عند بداية الصفحة
loadActors();
