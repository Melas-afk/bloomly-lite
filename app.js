console.log("Bloomly Lite запущен");

// Находим все кнопки навигации
const navButtons = document.querySelectorAll("nav button");

// Находим все секции
const pages = document.querySelectorAll(".page");

// Вешаем обработчик на каждую кнопку
navButtons.forEach(button => {
  button.addEventListener("click", () => {
    const pageName = button.dataset.page;

    // Скрываем все страницы
    pages.forEach(p => {
      p.style.display = "none";
    });

    // Показываем нужную страницу
    const activePage = document.getElementById(`page-${pageName}`);
    activePage.style.display = "block";
  });
});
