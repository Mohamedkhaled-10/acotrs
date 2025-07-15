const actorsContainer = document.getElementById("actorsContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

let actorsData = [];
let visibleActors = [];
let lockedActors = [];
let statsChart = null;

// تحميل بيانات الممثلين
async function loadActors() {
  try {
    const response = await fetch("actors.json");
    actorsData = await response.json();

    visibleActors = actorsData.slice(0, 3);
    lockedActors = actorsData.slice(3);

    displayActors(visibleActors);
    addSerialUnlockUI();
  } catch (error) {
    actorsContainer.innerHTML = "<p>خطأ في تحميل بيانات الممثلين.</p>";
    console.error(error);
  }
}

// عرض الممثلين
function displayActors(actors) {
  if (actors.length === 0) {
    actorsContainer.innerHTML = "<p>لم يتم العثور على ممثلين.</p>";
    return;
  }

  actorsContainer.innerHTML = actors
    .map(
      (actor) => `
      <div class="actor-card">
        <img src="${actor.image}" alt="${actor.name}" />
        <h3><i class="fas fa-user"></i> ${actor.name}</h3>
        <p>${actor.bio}</p>
        <div class="actor-actions">
          <button class="details-btn" onclick="showDetails('${actor.id}')">
            التفاصيل <i class="fas fa-arrow-left"></i>
          </button>
          <button class="fav-btn" onclick="toggleFavorite(event, '${actor.id}')">
            ${isFavorite(actor.id) ? "✔️ في المفضلة" : "⭐ أضف للمفضلة"}
          </button>
        </div>
      </div>
    `
    )
    .join("");

  addSerialUnlockUI(); // إعادة إظهار خانة السيريال بعد كل تحديث
}

// حقل إدخال السيريال
function addSerialUnlockUI() {
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

    if (found) {
      // تحقق إنه مش مكرر
      if (!visibleActors.find((a) => a.id === found.id)) {
        visibleActors.push(found);
        displayActors(visibleActors);
      } else {
        alert("🙃 هذه الممثلة ظاهرة بالفعل.");
      }
    } else {
      alert("❌ السيريال غير صحيح أو غير موجود.");
    }
  });
}

// عرض التفاصيل في المودال
function showDetails(id) {
  const actor = actorsData.find((a) => a.id === id);
  if (!actor) return;

  const stats = {
    "عدد الأفلام": actor.movies.length,
    "سنوات النشاط": new Date().getFullYear() - new Date(actor.birthDate).getFullYear() - 20,
    "عدد الجوائز": actor.awards || Math.floor(Math.random() * 10),
  };

  modalBody.innerHTML = `
    <h2>${actor.name}</h2>
    <img src="${actor.image}" alt="${actor.name}" />
    <div class="info-line"><i class="fas fa-calendar-alt"></i> تاريخ الميلاد: ${actor.birthDate}</div>
    <div class="info-line"><i class="fas fa-info-circle"></i> ${actor.bio}</div>
    <h3>أفلام:</h3>
    <ul class="movies-list">
      ${actor.movies.map((movie) => `<li>${movie}</li>`).join("")}
    </ul>
    ${
      actor.video
        ? `<video controls>
            <source src="${actor.video}" type="video/mp4" />
            متصفحك لا يدعم عرض الفيديو.
          </video>`
        : ""
    }
    <p>عدد الجوائز: ${actor.awards}</p>
    ${
      actor.website
        ? `<p>رابط الموقع الرسمي: 
             <a href="${actor.website}" target="_blank" rel="noopener" title="الموقع الرسمي">
               <img src="Logo_of_Pornhub.png" alt="Logo" style="height:150px; vertical-align:middle;" />
             </a>
           </p>`
        : ""
    }
    ${
      actor.gallery && actor.gallery.length > 0
        ? `
      <h3>ألبوم الصور:</h3>
      <div class="gallery">
        ${actor.gallery.map((img) => `<img src="${img}" alt="${actor.name}" class="gallery-img" />`).join("")}
      </div>` : ""
    }
    <div class="stats-container">
      <h3><i class="fas fa-chart-bar"></i> إحصائيات الممثل</h3>
      <canvas id="statsChart"></canvas>
    </div>
  `;

  modal.classList.remove("hidden");
  createOrUpdateChart(stats);
}

// رسم الإحصائيات
function createOrUpdateChart(stats) {
  const ctx = document.getElementById("statsChart").getContext("2d");
  const labels = Object.keys(stats);
  const data = Object.values(stats);

  if (statsChart) {
    statsChart.data.labels = labels;
    statsChart.data.datasets[0].data = data;
    statsChart.update();
  } else {
    statsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "إحصائيات",
            data: data,
            backgroundColor: ["#4caf50", "#80e27e", "#388e3c"],
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: "#eee" },
            grid: { color: "#333" },
          },
          y: {
            ticks: { color: "#eee" },
            grid: { color: "#333" },
          },
        },
        plugins: {
          legend: { labels: { color: "#eee" } },
          tooltip: { enabled: true },
        },
      },
    });
  }
}

// المفضلة
function toggleFavorite(e, actorId) {
  e.stopPropagation();
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.includes(actorId)) {
    favorites = favorites.filter((id) => id !== actorId);
  } else {
    favorites.push(actorId);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayActors(visibleActors);
}

// التحقق من المفضلة
function isFavorite(actorId) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favorites.includes(actorId);
}

// إغلاق المودال
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// البحث
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = visibleActors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm)
  );
  displayActors(filtered);
});

// بدء التحميل
loadActors();
