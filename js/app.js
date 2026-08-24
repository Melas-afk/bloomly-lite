console.log("Bloomly Lite запущен");

import { loadCommunityPhotos } from "./api.js";
import { translations } from "./translations.js";

let currentLang = localStorage.getItem("lang") || "ru";

// все кнопки 
const navButtons = document.querySelectorAll("nav button");

// все секции
const pages = document.querySelectorAll(".page");

// обработчик на каждую кнопку
navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const pageName = button.dataset.page;

    // Скрываем все страницы
    pages.forEach(p => {
      p.style.display = "none";
    });

    // Показываем что надо
    const activePage = document.getElementById(`page-${pageName}`);
    activePage.style.display = "block";
  });
});

const plants = []; // для растений

const addPlantForm = document.getElementById("add-plant-form");
const plantsList = document.getElementById("plants-list");

addPlantForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("plant-name").value;
  const description = document.getElementById("plant-description").value;
  const frequency = parseInt(document.getElementById("plant-frequency").value);

  const newPlant = new Plant(name, description, frequency);
  plants.push(newPlant);
  savePlants();

  renderPlant(newPlant);

  addPlantForm.reset();
});

// рендер карточки
function renderPlant(plant) {
  const t = translations[currentLang];

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

  // кнопка Полить
  const waterBtn = card.querySelector(".water-btn");
  waterBtn.addEventListener("click", () => {
    plant.water();
    card.querySelector(".plant-last-watered").textContent =
      t.lastWatered(plant.lastWatered.toLocaleDateString());
    savePlants();
  });

  // Редактирование
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

  // подробности
  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => {
    showPlantDetails(plant);
  });

  // Сохранение изменений
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

  //удаленеи
  const deleteBtn = card.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
  // из массива
  const index = plants.indexOf(plant);
  if (index !== -1) {
    plants.splice(index, 1);
  }
  // из дом!
  card.remove();
  savePlants();
  });

  plantsList.appendChild(card);
}

// сохранение
function savePlants() {
  localStorage.setItem("plants", JSON.stringify(plants));
}

// загругка
function loadPlants() {
  const data = localStorage.getItem("plants");
  if (!data) return;

  const parsed = JSON.parse(data);

  parsed.forEach(p => {
    const plant = new Plant(p.name, p.description, p.frequency);
    plant.lastWatered = new Date(p.lastWatered);
    plants.push(plant);
    renderPlant(plant);
  });
}

function showPlantDetails(plant) {
  const t = translations[currentLang];
  const detailsPage = document.getElementById("page-details");
  const detailsContent = document.getElementById("details-content");

  // нужно ли полить
  const needWater = getPlantsNeedingWatering().includes(plant);

  detailsContent.innerHTML = `
    <h3>${plant.name}</h3>
    <p><strong>${t.detailsDescriptionLabel}</strong> ${plant.description}</p>
    <p><strong>${t.detailsFrequencyLabel}</strong> ${plant.frequency} дней</p>
    <p><strong>${t.detailsLastWateredLabel}</strong> ${plant.lastWatered.toLocaleDateString()}</p>
    <p><strong>${t.detailsStatusLabel}</strong> ${needWater ? t.detailsStatusNeedWater : t.detailsStatusOk}</p>
  `;
  // типо якобы переход
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  detailsPage.style.display = "block";
}

// назад
document.getElementById("back-btn").addEventListener("click", () => {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById("page-plants").style.display = "block";
});

// функция вычисления статуса
function getPlantsNeedingWatering() {
  return plants.filter(p => {
    const diff = (Date.now() - p.lastWatered.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= p.frequency;
  });
}

// галерея 
let photos = [];
let currentPlantName = "";

// сохранение
function savePhotos() {
  localStorage.setItem("photos", JSON.stringify(photos));
}

// загрузка
function loadPhotos() {
  const data = localStorage.getItem("photos");
  if (!data) return;
  photos = JSON.parse(data);
}

// рендер галереи
function renderGallery(filterName = "") {
  const gallery = document.getElementById("gallery");

  let filtered = photos;

  if (filterName.trim() !== "") {
    filtered = photos.filter(p =>
      p.plantName.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  gallery.innerHTML = filtered
    .map((photo, index) => `
      <div class="photo-item">
        <img src="${photo.src}" alt="${photo.plantName}" class="gallery-photo" data-index="${index}">
        <p>${photo.plantName}</p>
        <button class="delete-photo-btn" data-index="${index}">Удалить</button>
      </div>
    `)
    .join("");

  // удаление фото
  document.querySelectorAll(".delete-photo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      photos.splice(index, 1);
      savePhotos();
      renderGallery(filterName);
    });
  });

  // открытие фото 
  document.querySelectorAll(".gallery-photo").forEach(img => {
    img.addEventListener("click", () => {
      const modal = document.getElementById("photo-modal");
      const modalImg = document.getElementById("modal-img");

      modalImg.src = img.src;
      modal.style.display = "flex";
    });
  });
}


// инициализация галереи
function initGallery() {
  const photoInput = document.getElementById("photo-input");
  const plantNameInput = document.getElementById("photo-plant-name");
  const uploadButton = document.getElementById("upload-photo-button");

  uploadButton.addEventListener("click", () => {
    const file = photoInput.files[0];
    const plantName = plantNameInput.value.trim();

    // проверка 
    if (!file) {
      alert("Выберите фото.");
      return;
    }

    // проверка
    if (plantName === "") {
      alert("Введите название растения.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imgSrc = reader.result;

      photos.push({
        src: imgSrc,
        plantName: plantName,
        date: new Date().toISOString()
      });

      savePhotos();
      renderGallery();
      photoInput.value = "";
      plantNameInput.value = "";
    };

    reader.readAsDataURL(file);
  });
}


// поиск
document.getElementById("gallery-search").addEventListener("input", (e) => {
  renderGallery(e.target.value);
});
const gallerySearch = document.getElementById("gallery-search");
const gallerySearchStatus = document.getElementById("gallery-search-status");

gallerySearch.addEventListener("input", debounce(() => {
  const query = gallerySearch.value.trim().toLowerCase();

  gallerySearchStatus.textContent = "Загрузка...";
  setTimeout(() => {
    const results = photos.filter(photo =>
      photo.plantName.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      gallerySearchStatus.textContent = "Ничего не найдено";
    } else {
      gallerySearchStatus.textContent = "";
    }

    renderGalleryResults(results);

  }, 300);

}, 300));



const modal = document.getElementById("photo-modal");
const modalClose = document.getElementById("modal-close");

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  // закрытие на клик по фону!
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// для поиска
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchInput = document.getElementById("plant-search");
const searchStatus = document.getElementById("search-status");

searchInput.addEventListener("input", debounce(() => {
  const query = searchInput.value.trim().toLowerCase();

  searchStatus.textContent = "Загрузка...";
  
  setTimeout(() => {
    const results = plants.filter(p =>
      p.name.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      searchStatus.textContent = "Ничего не найдено";
    } else {
      searchStatus.textContent = "";
    }

    renderPlants(results);
  }, 300);

}, 300));

function renderPlants(list) {
  plantsList.innerHTML = "";
  list.forEach(renderPlant);
}

//загрузчики 
loadPlants();
loadPhotos();
initGallery();
renderGallery();
loadCommunityPhotos(); 

// перевод
export function applyLanguage(lang) {
  const t = translations[lang];

  // навигация
  const buttons = document.querySelectorAll("header nav button");
  buttons[0].textContent = t.navMyPlants;
  buttons[1].textContent = t.navAddPlant;
  buttons[2].textContent = t.navGallery;

  // заголовки страниц
  document.querySelector("#page-plants h2").textContent = t.titleMyPlants;
  document.querySelector("#page-add h2").textContent = t.titleAddPlant;
  document.querySelector("#page-gallery h2").textContent = t.titleGallery;

  // подзаголовок
  document.getElementById("page-subtitle").textContent = t.pageSubtitle;

  // форма "добавить растение"
  const labels = document.querySelectorAll("#add-plant-form label");
  labels[0].textContent = t.labelName;
  labels[1].textContent = t.labelDescription;
  labels[2].textContent = t.labelFrequency;

  document.querySelector("#add-plant-form button[type='submit']").textContent = t.saveButton;

  // плейсхолдеры поиска
  document.getElementById("plant-search").placeholder = t.searchPlantsPlaceholder;
  document.getElementById("gallery-search").placeholder = t.searchGalleryPlaceholder;

  // галерея
  document.getElementById("photo-plant-name").placeholder = t.photoPlantNamePlaceholder;
  document.getElementById("upload-photo-button").textContent = t.uploadButton;
  document.querySelector("#page-gallery h3").textContent = t.communityDemoTitle;
}


// обработка кликов по кастомному меню
document.querySelectorAll(".lang-option").forEach(option => {
  option.addEventListener("click", () => {
    const lang = option.dataset.lang;

    // визуальное переключение
    document.querySelectorAll(".lang-option").forEach(o => o.classList.remove("active"));
    option.classList.add("active");

    // смена языка
    setLanguage(lang);
  });
});



export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  applyLanguage(lang);
  renderPlants(plants);
  renderGallery();

  // если открыта страница "Подробнее"
  const detailsPage = document.getElementById("page-details");
  if (detailsPage.style.display === "block") {
    const plantName = document.querySelector("#details-content h3")?.textContent;
    const plant = plants.find(p => p.name === plantName);
    if (plant) showPlantDetails(plant);
  }
}

const savedLang = localStorage.getItem("lang") || "ru";
setLanguage(savedLang);

// выставляем активный язык в кастомном меню
document.querySelectorAll(".lang-option").forEach(o => {
  if (o.dataset.lang === savedLang) {
    o.classList.add("active");
  } else {
    o.classList.remove("active");
  }
});
