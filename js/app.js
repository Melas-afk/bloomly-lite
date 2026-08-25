console.log("Bloomly Lite запущен");

import { initNavigation, initBackButton } from "./navigation.js";

import { loadPlants } from "./storage.js";
import { renderPlant } from "./render.js";
import { initAddPlantForm} from "./events.js";
import { initPlantSearch } from "./search-plants.js";

import { loadPhotos } from "./storage.js";
import { initGallery, renderGallery } from "./gallery.js";
import { initGallerySearch } from "./gallery-search.js";
import { initPhotoModal } from "./modal.js";

import { setLanguage, initLanguageMenu } from "./i18n.js";

import { loadCommunityPhotos } from "./api.js";

import { plants } from "./state.js";


function init() {

  initNavigation();
  initBackButton();

  initAddPlantForm();
  loadPlants();
  plants.forEach(renderPlant);

  initPlantSearch();

  loadPhotos();
  initGallery();
  renderGallery();

  initGallerySearch();

  initPhotoModal();

  initLanguageMenu();
  const savedLang = localStorage.getItem("lang") || "ru";
  setLanguage(savedLang);

  loadCommunityPhotos();
}

init();
