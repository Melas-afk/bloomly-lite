import { plants, photos } from "./state.js";

export function savePlants() {
  localStorage.setItem("plants", JSON.stringify(plants));
}

export function loadPlants() {
  const data = JSON.parse(localStorage.getItem("plants") || "[]");

  data.forEach(p => {
    const plant = new Plant(p.name, p.description, p.frequency);
    plant.lastWatered = new Date(p.lastWatered);
    plants.push(plant);
  });

  return plants;
}

export function savePhotos() {
  localStorage.setItem("photos", JSON.stringify(photos));
}

export function loadPhotos() {
  const data = JSON.parse(localStorage.getItem("photos") || "[]");
  photos.push(...data);
}
