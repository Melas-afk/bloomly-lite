export async function loadCommunityPhotos() {
  const communityContainer = document.getElementById("community-gallery");
  const status = document.getElementById("community-status");

  status.textContent = "Загрузка...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=10");

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }

    const data = await response.json();

    status.textContent = "";

    communityContainer.innerHTML = data
      .map(photo => `
        <div class="photo-item">
          <img src="${photo.thumbnailUrl}" alt="${photo.title}">
          <p>${photo.title}</p>
        </div>
      `)
      .join("");

  } catch (error) {
    status.textContent = "Не удалось загрузить фото сообщества.";
    console.error(error);
  }
}
