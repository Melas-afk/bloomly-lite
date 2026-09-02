import { translations } from "./translations.js";
import { getCurrentLang } from "./state.js";
import { savePlants } from "./storage.js";
import { showPlantDetails } from "./details.js";
import { attachPlantCardEvents } from "./events.js";
import { Plant } from "./plant.js";


export function renderPlant(plant) {
  const t = translations[getCurrentLang()];
  const card = document.createElement("div");
  card.classList.add("plant-card");

  card.innerHTML = `
    <h3 class="plant-name">${plant.name}</h3>
    <p class="plant-description">${plant.description}</p>
    <p class="plant-frequency">${t.waterEveryDays(plant.frequency)}</p>
    <p class="plant-last-watered">${t.lastWatered(plant.lastWatered.toLocaleDateString())}</p>
    <button class="water-btn">${t.waterBtn}</button>
    <button class="edit-btn">${t.editBtn}</button>
    <button class="details-btn">${t.detailsBtn}</button>
    <button class="delete-btn">${t.deleteBtn}</button>
  `;

  attachPlantCardEvents(card, plant);
  document.getElementById("plants-list").appendChild(card);

  const desc = card.querySelector(".plant-description");

    desc.addEventListener("click", () => {
      desc.classList.toggle("expanded");
    });

}

export function renderPlants(list) {
  const container = document.getElementById("plants-list");
  container.innerHTML = "";
  list.forEach(renderPlant);
}
