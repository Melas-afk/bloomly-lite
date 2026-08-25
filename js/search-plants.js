import { debounce } from "./utils.js";
import { plants } from "./state.js";
import { renderPlants } from "./render.js";

export function initPlantSearch() {
  const input = document.getElementById("plant-search");
  const status = document.getElementById("search-status");

  input.addEventListener("input", debounce(() => {
    const query = input.value.trim().toLowerCase();
    status.textContent = "Загрузка...";

    setTimeout(() => {
      const results = plants.filter(p => p.name.toLowerCase().includes(query));
      status.textContent = results.length ? "" : "Ничего не найдено";
      renderPlants(results);
    }, 300);
  }, 300));
}

