import { translations } from "./translations.js";
import { getCurrentLang, plants } from "./state.js";
import { getPlantsNeedingWatering } from "./utils.js";

export function showPlantDetails(plant) {
  const t = translations[getCurrentLang()];
  const detailsPage = document.getElementById("page-details");
  const detailsContent = document.getElementById("details-content");

  const needWater = getPlantsNeedingWatering(plants).includes(plant);

  detailsContent.innerHTML = `
    <h3>${plant.name}</h3>
    <p>${plant.description}</p>
    <p>${t.detailsFrequencyLabel} ${plant.frequency} ${t.Days} </p>
    <p>${t.detailsLastWateredLabel} ${plant.lastWatered.toLocaleDateString()}</p>
    <p class="status-line" >${t.detailsStatusLabel} <strong>${needWater ? t.detailsStatusNeedWater : t.detailsStatusOk}</strong></p>
  
    <button id="back-btn">${t.backBtn}</button>
    `;

    const leaf1 = document.createElement("img");
    leaf1.src = "pic/monleaves1.png";
    leaf1.classList.add("leaf", "leaf-top");

    const leaf2 = document.createElement("img");
    leaf2.src = "pic/monleaves2.png";
    leaf2.classList.add("leaf", "leaf-bottom");

    document.body.appendChild(leaf1);
    document.body.appendChild(leaf2);

    const backBtn = document.getElementById("back-btn");
    backBtn.addEventListener("click", () => {
      document.querySelectorAll(".page").forEach(p => p.style.display = "none");
      document.getElementById("page-plants").style.display = "block";
      
      leaf1.remove();
      leaf2.remove();
    });

  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  detailsPage.style.display = "block";
}

