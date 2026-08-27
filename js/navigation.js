export function initNavigation() {
  const navButtons = document.querySelectorAll("nav button");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const pageName = button.dataset.page;
      pages.forEach(p => p.style.display = "none");
      document.getElementById(`page-${pageName}`).style.display = "block";
    });
  });
}
