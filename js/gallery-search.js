import { debounce } from "./utils.js";
import { photos } from "./state.js";
import { renderGallery } from "./gallery.js";

export function initGallerySearch() {
  const input = document.getElementById("gallery-search");
  const status = document.getElementById("gallery-search-status");

  input.addEventListener("input", debounce(() => {
    const query = input.value.trim().toLowerCase();
    status.textContent = "Загрузка...";

    setTimeout(() => {
      const results = photos.filter(p => p.plantName.toLowerCase().includes(query));
      status.textContent = results.length ? "" : "Ничего не найдено";
      renderGallery(query);
    }, 300);
  }, 300));
}
