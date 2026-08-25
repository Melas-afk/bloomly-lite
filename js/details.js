import { translations } from "./translations.js";
import { getCurrentLang } from "./state.js";
import { getPlantsNeedingWatering } from "./utils.js";

export function showPlantDetails(plant) {
  const t = translations[getCurrentLang()];
  const detailsPage = document.getElementById("page-details");
  const detailsContent = document.getElementById("details-content");

  const needWater = getPlantsNeedingWatering(plants).includes(plant);

  detailsContent.innerHTML = `
    <h3>${plant.name}</h3>
    <p><strong>${t.detailsDescriptionLabel}</strong> ${plant.description}</p>
    <p><strong>${t.detailsFrequencyLabel}</strong> ${plant.frequency} дней</p>
    <p><strong>${t.detailsLastWateredLabel}</strong> ${plant.lastWatered.toLocaleDateString()}</p>
    <p><strong>${t.detailsStatusLabel}</strong> ${needWater ? t.detailsStatusNeedWater : t.detailsStatusOk}</p>
  `;

  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  detailsPage.style.display = "block";
}

