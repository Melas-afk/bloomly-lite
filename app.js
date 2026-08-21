console.log("Bloomly Lite запущен");

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
  const card = document.createElement("div");
  card.classList.add("plant-card");

  card.innerHTML = `
    <h3 class="plant-name">${plant.name}</h3>
    <p class="plant-description">${plant.description}</p>
    <p class="plant-frequency">Полив каждые ${plant.frequency} дней</p>
    <p class="plant-last-watered">Последний полив: ${plant.lastWatered.toLocaleDateString()}</p>
    <button class="water-btn">Полить</button>
    <button class="edit-btn">Редактировать</button>
    <button class="details-btn">Подробнее</button>
    <button class="delete-btn">Удалить</button>
  `;

  // кнопка Полить
  const waterBtn = card.querySelector(".water-btn");
  waterBtn.addEventListener("click", () => {
    plant.water();
    card.querySelector(".plant-last-watered").textContent =
      `Последний полив: ${plant.lastWatered.toLocaleDateString()}`;
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
    <button class="save-edit-btn">Сохранить</button>
  `;
  card.appendChild(editForm);

  editBtn.addEventListener("click", () => {
    editForm.style.display = "block";
  });

  // подробности
  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => {
    console.log("detailsBtn для", plant.name, detailsBtn);
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
      `Полив каждые ${plant.frequency} дней`;

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

loadPlants();

function showPlantDetails(plant) {
  console.log("showPlantDetails вызван для", plant.name);
  const detailsPage = document.getElementById("page-details");
  const detailsContent = document.getElementById("details-content");

  // нужно ли полить
  const needWater = getPlantsNeedingWatering().includes(plant);

  detailsContent.innerHTML = `
    <h3>${plant.name}</h3>
    <p><strong>Описание:</strong> ${plant.description}</p>
    <p><strong>Частота полива:</strong> ${plant.frequency} дней</p>
    <p><strong>Последний полив:</strong> ${plant.lastWatered.toLocaleDateString()}</p>
    <p><strong>Статус:</strong> ${needWater ? "Нужно полить" : "Всё хорошо"}</p>
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
