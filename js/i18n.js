import { translations } from "./translations.js";
import { getCurrentLang, setCurrentLang, plants } from "./state.js";
import { renderPlants } from "./render.js";
import { renderGallery } from "./gallery.js";
import { showPlantDetails } from "./details.js";

export function applyLanguage(lang) {
  const t = translations[lang];

  const buttons = document.querySelectorAll("header nav button");
  buttons[0].textContent = t.navMyPlants;
  buttons[1].textContent = t.navAddPlant;
  buttons[2].textContent = t.navGallery;

  document.querySelector("#page-plants h2").textContent = t.titleMyPlants;
  document.querySelector("#page-add h2").textContent = t.titleAddPlant;
  document.querySelector("#page-gallery h2").textContent = t.titleGallery;

  document.getElementById("page-subtitle").textContent = t.pageSubtitle;

  const labels = document.querySelectorAll("#add-plant-form label");
  labels[0].textContent = t.labelName;
  labels[1].textContent = t.labelDescription;
  labels[2].textContent = t.labelFrequency;

  document.querySelector("#add-plant-form button[type='submit']").textContent = t.saveButton;

  document.getElementById("plant-search").placeholder = t.searchPlantsPlaceholder;
  document.getElementById("gallery-search").placeholder = t.searchGalleryPlaceholder;

  document.getElementById("photo-plant-name").placeholder = t.photoPlantNamePlaceholder;
  document.getElementById("upload-photo-button").textContent = t.uploadButton;
  document.querySelector("#page-gallery h3").textContent = t.communityDemoTitle;
}

export function setLanguage(lang) {
  setCurrentLang(lang);

  applyLanguage(lang);
  renderPlants(plants);
  renderGallery();

  const detailsPage = document.getElementById("page-details");
  if (detailsPage.style.display === "block") {
    const name = document.querySelector("#details-content h3")?.textContent;
    const plant = plants.find(p => p.name === name);
    if (plant) showPlantDetails(plant);
  }
}

export function initLanguageMenu() {
  document.querySelectorAll(".lang-option").forEach(option => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang;

      document.querySelectorAll(".lang-option").forEach(o => o.classList.remove("active"));
      option.classList.add("active");

      setLanguage(lang);
    });
  });
}



