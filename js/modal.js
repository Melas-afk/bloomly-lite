export function initPhotoModal() {
  const modal = document.getElementById("photo-modal");
  const close = document.getElementById("modal-close");

  close.addEventListener("click", () => modal.style.display = "none");

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

