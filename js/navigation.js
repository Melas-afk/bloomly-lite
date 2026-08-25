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

export function initBackButton() {
  document.getElementById("back-btn").addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById("page-plants").style.display = "block";
  });
}
