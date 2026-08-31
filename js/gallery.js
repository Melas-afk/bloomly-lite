import { photos, getCurrentLang } from "./state.js";
import { savePhotos } from "./storage.js";
import { translations } from "./translations.js";

export function renderGallery(filter = "") {
  const t = translations[getCurrentLang()];
  const gallery = document.getElementById("gallery");

  const filtered = filter
    ? photos.filter(p => p.plantName.toLowerCase().includes(filter.toLowerCase()))
    : photos;

  gallery.innerHTML = filtered.map((photo, index) => `
    <div class="photo-item">
      <img src="${photo.src}" class="gallery-photo" data-index="${index}">
      <p>${photo.plantName}</p>
      <button class="delete-photo-btn" data-index="${index}">${t.deleteBtn}</button>
    </div>
  `).join("");

  initGalleryEvents(filter);
}

export function initGallery() {
  const input = document.getElementById("photo-input");
  const nameInput = document.getElementById("photo-plant-name");
  const uploadBtn = document.getElementById("upload-photo-button");
  const fileNameLabel = document.getElementById("selected-file-name");
  const selectFileLabel = document.querySelector(".upload-file-btn");

  const t = translations[getCurrentLang()];

  fileNameLabel.textContent = t.noFileSelected;
  selectFileLabel.textContent = t.selectFileBtn;

  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      fileNameLabel.textContent = input.files[0].name;
    } else {
      fileNameLabel.textContent = t.noFileSelected;
    }
  });

  uploadBtn.addEventListener("click", () => {
    const file = input.files[0];
    const name = nameInput.value.trim();
    if (!file || !name) return;

    const reader = new FileReader();
    reader.onload = () => {
      photos.push({ src: reader.result, plantName: name, date: new Date() });
      savePhotos();
      renderGallery();

      input.value = "";              
      fileNameLabel.textContent = t.noFileSelected;  
    };
    reader.readAsDataURL(file);
  });
}

export function initGalleryEvents(filterName = "") {
  const deleteButtons = document.querySelectorAll(".delete-photo-btn");
  const galleryPhotos = document.querySelectorAll(".gallery-photo");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      photos.splice(index, 1);
      savePhotos();
      renderGallery(filterName);
    });
  });

  galleryPhotos.forEach(img => {
    img.addEventListener("click", () => {
      const modal = document.getElementById("photo-modal");
      const modalImg = document.getElementById("modal-img");

      modalImg.src = img.src;
      modal.style.display = "flex";
    });
  });
}
