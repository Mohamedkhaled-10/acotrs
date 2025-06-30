const actorsContainer = document.getElementById("actorsContainer");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

let actorsData = [];
let statsChart = null;

// تحميل بيانات الممثلين
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

// عرض قائمة الممثلين مع أيقونة نجمة أمام الاسم
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
        <h3><i class="fas fa-user"></i> ${actor.name}</h3>
        <p>${actor.bio}</p>
        <button class="details-btn">التفاصيل <i class="fas fa-arrow-left"></i></button>
      </div>
    `
    )
    .join("");
}

// عرض تفاصيل الممثل في النافذة المنبثقة مع رسم إحصائيات وألبوم صور وروابط
function showDetails(id) {
  const actor = actorsData.find((a) => a.id === id);
  if (!actor) return;

  // بيانات إحصائيات وهمية (ممكن تعدل في ملف JSON وتضيف الحقول دي)
  const stats = {
    "عدد الأفلام": actor.movies.length,
    "سنوات النشاط": new Date().getFullYear() - new Date(actor.birthDate).getFullYear() - 20, // مثال
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
         <a href="${actor.https://www.pornhub.com/pornstar/eva-elfie}" target="_blank" rel="noopener" title="الموقع الرسمي">
           <img src="images/Logo_of_Pornhub.png" alt="Logo" style="height:24px; vertical-align:middle;" />
         </a>
       </p>`
    : ""
}

    ${
      actor.gallery && actor.gallery.length > 0
        ? `
      <h3>ألبوم الصور:</h3>
      <div class="gallery">
        ${actor.gallery
          .map(
            (img) =>
              `<img src="${img}" alt="${actor.name}" class="gallery-img" />`
          )
          .join("")}
      </div>
    `
        : ""
    }
    <div class="stats-container">
      <h3><i class="fas fa-chart-bar"></i> إحصائيات الممثل</h3>
      <canvas id="statsChart"></canvas>
    </div>
  `;

  modal.classList.remove("hidden");

  createOrUpdateChart(stats);
}

// دالة لإنشاء أو تحديث الرسم البياني
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

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = actorsData.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm)
  );
  displayActors(filtered);
});

loadActors();
