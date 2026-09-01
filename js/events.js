import { savePlants } from "./storage.js";
import { showPlantDetails } from "./details.js";
import { translations } from "./translations.js";
import { getCurrentLang, plants } from "./state.js";
import { renderPlant } from "./render.js";
import { Plant } from "./plant.js";

export function initAddPlantForm() {
  const form = document.getElementById("add-plant-form");
  const nameInput = document.getElementById("plant-name");
  const descriptionInput = document.getElementById("plant-description");
  const frequencyInput = document.getElementById("plant-frequency");

  form.addEventListener("submit", e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const frequency = parseInt(frequencyInput.value);

  if (!name || !frequency) return;

  const plant = new Plant(name, description, frequency);
  plants.push(plant);

  savePlants();
  renderPlant(plant);
  
  location.reload();
});

}


export function attachPlantCardEvents(card, plant) {
  const t = translations[getCurrentLang()];

  const waterBtn = card.querySelector(".water-btn");
  waterBtn.addEventListener("click", () => {
    plant.water();
    card.querySelector(".plant-last-watered").textContent =
      t.lastWatered(plant.lastWatered.toLocaleDateString());
    savePlants();
  });

  const editBtn = card.querySelector(".edit-btn");
  const editForm = document.createElement("div");
  editForm.classList.add("edit-form");
  editForm.style.display = "none";
  editForm.innerHTML = `
    <input type="text" class="edit-name" value="${plant.name}">
    <textarea class="edit-description">${plant.description}</textarea>
    <input type="number" class="edit-frequency" value="${plant.frequency}">
    <button class="save-edit-btn">${t.saveEditBtn}</button>
  `;
  card.appendChild(editForm);

  editBtn.addEventListener("click", () => {
    editForm.style.display = "block";
  });

  const saveEditBtn = editForm.querySelector(".save-edit-btn");
  saveEditBtn.addEventListener("click", () => {
    plant.name = editForm.querySelector(".edit-name").value;
    plant.description = editForm.querySelector(".edit-description").value;
    plant.frequency = parseInt(editForm.querySelector(".edit-frequency").value);

    card.querySelector(".plant-name").textContent = plant.name;
    card.querySelector(".plant-description").textContent = plant.description;
    card.querySelector(".plant-frequency").textContent =
      t.waterEveryDays(plant.frequency);

    savePlants();
    editForm.style.display = "none";
  });

  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => {
    showPlantDetails(plant);
  });

  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    const index = plants.indexOf(plant);
    if (index !== -1) plants.splice(index, 1);
    card.remove();
    savePlants();
  });
}