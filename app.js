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
    <h3>${plant.name}</h3>
    <p>${plant.description}</p>
    <p>Полив каждые ${plant.frequency} дней</p>
    <p>Последний полив: ${plant.lastWatered.toLocaleDateString()}</p>
    <button class="water-btn">Полить</button>
  `;

  // кнопка Полить
  const waterBtn = card.querySelector(".water-btn");
  waterBtn.addEventListener("click", () => {
    plant.water();
    card.querySelector("p:nth-child(4)").textContent =
      `Последний полив: ${plant.lastWatered.toLocaleDateString()}`;
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
